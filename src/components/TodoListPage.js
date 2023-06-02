import React, { useState,useEffect } from "react";
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
} from "@chakra-ui/react";
import { MdDelete, MdAddCircle } from "react-icons/md";
import { fireStore } from "../firbase";
import { addDoc, onSnapshot,collection} from 'firebase/firestore';

export default function TodoListPage() {
  const [todos, setTodos] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Firestore에서 할 일 목록 가져오기
    const unsubscribe = onSnapshot(collection(fireStore,'todos'),(snapshot) => {
      const todosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTodos(todosData);
    });

    return () => {
      // Cleanup 함수: 구독 취소
      unsubscribe();
    };
  }, []);

  const onClickList = (id, title) => {
    navigate(`detail/${id}`, { state: { title, previousPage: "TodoListPage" } });
  };

  const handleAddTodo = () => {
    const newTodo = {
      title: newTodoTitle,
      subTodos: [],
    };

    addDoc(collection(fireStore,"todos"), (newTodo))
      .then((docRef) => {
        setNewTodoTitle("");
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleDeleteTodo = (id) => {
    fireStore.collection("todos")
      .doc(id)
      .delete()
      .catch((error) => {
        console.error("Error deleting document: ", error);
      });
  };

  const handleAddSubTodo = (parentId) => {
    const newSubTodo = {
      id: todos.length + 1,
      title: "",
    };

    const updatedTodos = todos.map((todo) => {
      if (todo.id === parentId) {
        return {
          ...todo,
          subTodos: [...todo.subTodos, newSubTodo],
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleUpdateSubTodo = (parentId, subTodoId, value) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === parentId) {
        const updatedSubTodos = todo.subTodos.map((subTodo) => {
          if (subTodo.id === subTodoId) {
            return {
              ...subTodo,
              title: value,
            };
          }
          return subTodo;
        });

        return {
          ...todo,
          subTodos: updatedSubTodos,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  const handleDeleteSubTodo = (parentId, subTodoId) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === parentId) {
        const updatedSubTodos = todo.subTodos.filter((subTodo) => subTodo.id !== subTodoId);

        return {
          ...todo,
          subTodos: updatedSubTodos,
        };
      }
      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <VStack divider={<StackDivider borderColor={"blackAlpha.500"} />} spacing={4} py={"5"}>
      <Box my={"5"} bg={"gray.200"} padding={"20"} overflow={"hidden"} rounded={"xl"} shadow={"dark-lg"}>
        <HStack justifyContent={"space-between"} mb={"12"} borderBottomWidth={2} borderBottomColor={"blackAlpha.300"}>
          <Text mb="1" as={"b"} fontSize={"xl"}>
            Add Subject
          </Text>
          <Box>
            <IconButton mb="1" colorScheme="green" icon={<MdAddCircle />} onClick={() => setIsModalOpen(true)}>
              Add Todo
            </IconButton>
          </Box>
        </HStack>

        <List spacing={6}>
          {todos.map((todo) => (
            <ListItem key={todo.id} width={64}>
              <Box bg={"green.300"} overflow={"hidden"} rounded={"xl"} shadow={"lg"}>
                <HStack justifyContent={"space-between"} py={"5"} px={"5"}>
                  <Text as={"b"} onClick={() => onClickList(todo.id, todo.title)}>
                    {todo.title}
                  </Text>
                  <IconButton colorScheme="red" size="lg" ml={2} onClick={() => handleDeleteTodo(todo.id)} icon={<MdDelete />} />
                </HStack>

                <VStack spacing={2}>
                  {todo.subTodos.map((subTodo) => (
                    <TodoItem
                      key={subTodo.id}
                      parentTodoId={todo.id}
                      subTodo={subTodo}
                      handleUpdateSubTodo={handleUpdateSubTodo}
                      handleDeleteSubTodo={handleDeleteSubTodo}
                    />
                  ))}
                  <IconButton
                    colorScheme="green"
                    icon={<MdAddCircle />}
                    onClick={() => handleAddSubTodo(todo.id)}
                  >
                    Add Sub Todo
                  </IconButton>
                </VStack>
              </Box>
            </ListItem>
          ))}
        </List>
      </Box>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Todo</ModalHeader>
          <ModalBody>
            <Input value={newTodoTitle} onChange={(e) => setNewTodoTitle(e.target.value)} placeholder="Todo title" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleAddTodo}>
              Add
            </Button>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
}

const TodoItem = ({ parentTodoId, subTodo, handleUpdateSubTodo, handleDeleteSubTodo }) => {
  const handleUpdate = (e) => {
    handleUpdateSubTodo(parentTodoId, subTodo.id, e.target.value);
  };

  const handleDelete = () => {
    handleDeleteSubTodo(parentTodoId, subTodo.id);
  };

  return (
    <HStack>
      <Input value={subTodo.title} onChange={handleUpdate} placeholder="Sub Todo title" />
      <IconButton colorScheme="red" size="lg" ml={2} onClick={handleDelete} icon={<MdDelete />} />
    </HStack>
  );
};
