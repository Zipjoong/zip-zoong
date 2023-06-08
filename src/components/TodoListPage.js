import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  List,
  ListItem,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  VStack,
  StackDivider,
  HStack,
  IconButton,
  Checkbox,
} from "@chakra-ui/react";
import { MdDelete, MdAddCircle } from "react-icons/md";
import { fireStore } from "../firbase";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  onSnapshot,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

function formatTime(time) {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

export default function TodoListPage() {
  const [subjects, setSubjects] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSubjectTitle, setNewSubjectTitle] = useState("");
  const [dura, setDura] = useState();
  const [sum, setSum] = useState();

  const navigate = useNavigate();

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(
      collection(fireStore, "STUDY_SUBJECTS"),
      where("user_id", "==", user.uid)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const subjectsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubjects(subjectsData);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    // 컴포넌트가 마운트될 때 데이터 가져오기
    const q = query(
      collection(fireStore, "STUDY_RECORDS"),
      where("user_id", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groups = {};
      snapshot.forEach((doc) => {
        const { subject_id, real_study_time } = doc.data();
        if (!groups[subject_id]) {
          groups[subject_id] = 0;
        }
        groups[subject_id] += real_study_time;
      });
      console.log(groups, "===================");
      // 집계된 그룹의 start_time 값을 합산
      const totalSum = Object.values(groups).reduce((acc, val) => acc + val, 0);
      setDura(groups);

      setSum(totalSum);
      //console.log(parseInt(totalSum[0]));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const onClickList = (subjectId, subjectTitle) => {
    //클릭하면 STUDYRECORDS에 add
    const newSubject = {
      subject_id: subjectId,
      user_id: user.uid,
      start_time: serverTimestamp(),
      end_time: serverTimestamp(),
      real_study_time: 0,
    };

    addDoc(collection(fireStore, "STUDY_RECORDS"), newSubject)
      .then((docRef) => {
        console.log(docRef.id);
        navigate(`detail/${subjectId}`, {
          state: {
            title: subjectTitle,
            docid: docRef.id,
            previousPage: "TodoListPage",
          },
        });
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleAddSubject = () => {
    const newSubject = {
      subject_name: newSubjectTitle,
      user_id: user.uid,
    };

    addDoc(collection(fireStore, "STUDY_SUBJECTS"), newSubject)
      .then((docRef) => {
        setNewSubjectTitle("");
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleDeleteSubject = (subjectId) => {
    deleteDoc(doc(fireStore, "STUDY_SUBJECTS", subjectId)).catch((error) => {
      console.error("Error deleting document: ", error);
    });
  };

  return (
    <VStack
      divider={<StackDivider borderColor={"blackAlpha.500"} />}
      spacing={4}
      py={"5"}
    >
      <Box>
        <Text fontSize={"5xl"} as={"b"}>
          Total StudyTime : {formatTime(sum)}
        </Text>
      </Box>
      <Box
        my={"5"}
        bg={"blue.50"}
        padding={"20"}
        overflow={"hidden"}
        rounded={"xl"}
        shadow={"dark-lg"}
      >
        <HStack
          justifyContent={"space-between"}
          mb={"12"}
          borderBottomWidth={2}
          borderBottomColor={"blackAlpha.300"}
        >
          <Text mb="1" as={"b"} fontSize={"xl"}>
            Add Subject
          </Text>
          <Box>
            <IconButton
              mb="1"
              colorScheme="blue"
              icon={<MdAddCircle />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Subject
            </IconButton>
          </Box>
        </HStack>

        <List spacing={6}>
          {subjects.map((subject) => (
            <ListItem key={subject.id} width={64}>
              <Box
                bg={"blue.300"}
                overflow={"hidden"}
                rounded={"xl"}
                shadow={"lg"}
              >
                <HStack justifyContent={"space-between"} py={"5"} px={"5"}>
                  <Text
                    as={"b"}
                    fontSize={"xl"}
                    onClick={() =>
                      onClickList(subject.id, subject.subject_name)
                    }
                  >
                    {subject.subject_name}
                  </Text>
                  <Text as={"b"}>{dura && formatTime(dura[subject.id])}</Text>

                  <IconButton
                    colorScheme="red"
                    size="md"
                    ml={2}
                    onClick={() => handleDeleteSubject(subject.id)}
                    icon={<MdDelete />}
                  />
                </HStack>
                <Box>
                  <TodoSubList subjectId={subject.id} />
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Subject</ModalHeader>
          <ModalBody>
            <Input
              value={newSubjectTitle}
              onChange={(e) => setNewSubjectTitle(e.target.value)}
              placeholder="Subject title"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddSubject}>
              Add
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

const TodoSubList = ({ subjectId }) => {
  const [todos, setTodos] = useState([]);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  useEffect(() => {
    const q = query(
      collection(fireStore, "TODO_LISTS"),
      where("subject_id", "==", subjectId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    });

    return () => {
      unsubscribe();
    };
  }, [subjectId]);

  const handleAddTodo = () => {
    const newTodo = {
      subject_id: subjectId,
      title: newTodoTitle,
      timestamp: Date.now(),
      // subTodos: [],
    };

    addDoc(collection(fireStore, "TODO_LISTS"), newTodo)
      .then((docRef) => {
        setNewTodoTitle(""); // 입력 필드 초기화
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleDeleteTodo = (todoId) => {
    deleteDoc(doc(fireStore, "TODO_LISTS", todoId)).catch((error) => {
      console.error("Error deleting document: ", error);
    });
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      spacing={2}
      padding={"5"}
    >
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleDeleteTodo={handleDeleteTodo}
        />
      ))}
      <HStack>
        <Input
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Todo title"
        />
        <IconButton
          colorScheme="blue"
          icon={<MdAddCircle />}
          onClick={handleAddTodo}
        >
          Add Todo
        </IconButton>
      </HStack>
    </Box>
  );
};

const TodoItem = ({ todo, handleDeleteTodo }) => {
  const handleDelete = () => {
    handleDeleteTodo(todo.id);
  };

  const handleToggleComplete = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    updateDoc(doc(fireStore, "TODO_LISTS", todo.id), updatedTodo).catch(
      (error) => {
        console.error("Error updating document: ", error);
      }
    );
  };

  return (
    <VStack alignItems="flex-start" mb={"3"}>
      <HStack>
        <Checkbox
          size="lg"
          defaultChecked={todo.completed}
          onChange={handleToggleComplete}
        />
        <Text>{todo.title}</Text>
        <Box>
          <IconButton
            colorScheme="red"
            size="xs"
            ml={2}
            onClick={handleDelete}
            icon={<MdDelete />}
          />
        </Box>
      </HStack>
    </VStack>
  );
};
