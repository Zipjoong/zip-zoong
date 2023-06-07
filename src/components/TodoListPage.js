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
import { MdDelete, MdAddCircle, MdCheckBox } from "react-icons/md";
import { fireStore } from "../firbase";
import {
  addDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  doc,
  query,
  where,
  onSnapshot,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

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
        const { subject_id, start_time, end_time } = doc.data();
        if (!groups[subject_id]) {
          groups[subject_id] = 0;
        }
        groups[subject_id] += end_time - start_time;
      });
      console.log(groups, "===================");
      // 집계된 그룹의 start_time 값을 합산
      const totalSum = Object.values(groups);
      //.reduce((acc, val) => acc + val, 0);
      setDura(groups);

      //setSum(totalSum);
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
      title: newSubjectTitle,
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
      <Box
        my={"5"}
        bg={"gray.200"}
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
              colorScheme="green"
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
                bg={"green.300"}
                overflow={"hidden"}
                rounded={"xl"}
                shadow={"lg"}
              >
                <HStack justifyContent={"space-between"} py={"5"} px={"5"}>
                  <Text
                    as={"b"}
                    onClick={() => onClickList(subject.id, subject.title)}
                  >
                    {subject.title}
                  </Text>
                  <IconButton
                    colorScheme="red"
                    size="lg"
                    ml={2}
                    onClick={() => handleDeleteSubject(subject.id)}
                    icon={<MdDelete />}
                  />
                </HStack>

                <TodoSubList subjectId={subject.id} />
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
            <Button colorScheme="green" mr={3} onClick={handleAddSubject}>
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
    <VStack spacing={2}>
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
          colorScheme="green"
          icon={<MdAddCircle />}
          onClick={handleAddTodo}
        >
          Add Todo
        </IconButton>
      </HStack>
    </VStack>
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
    <HStack>
      <Checkbox
        size="lg"
        defaultChecked={todo.completed}
        onChange={handleToggleComplete}
      />
      <Text>{todo.title}</Text>
      <IconButton
        colorScheme="red"
        size="lg"
        ml={2}
        onClick={handleDelete}
        icon={<MdDelete />}
      />
    </HStack>
  );
};
