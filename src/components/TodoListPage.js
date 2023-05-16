import { useState } from "react";
import {  useNavigate } from "react-router-dom";
import { Box, List, ListItem, Text, Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, VStack, StackDivider, HStack, IconButton } from "@chakra-ui/react";
import {MdDelete, MdAddCircle} from 'react-icons/md';

export default function TodoListPage() {
  const [todos, setTodos] = useState([
    { id: 1, title: "Math" },
    { id: 2, title: "Korean" },
    
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTodoTitle, setNewTodoTitle] = useState("");

  const navigate = useNavigate();
  const onClickList = (id,title) => {
    navigate(`detail/${id}`, { state: { title } })
  }

  const handleAddTodo = () => {
    const newTodo = {
      id: todos.length + 1,
      title: newTodoTitle,
    };

    setTodos([...todos, newTodo]);
    setNewTodoTitle("");
    setIsModalOpen(false);
  };

  const handleDeleteTodo = (id) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (

    <VStack 
      divider={<StackDivider borderColor={'blackAlpha.500'}/>}
      spacing={4}
      py={"5"}
    >
      {/* <Box p={4}> */}
      <Box>
        <Text as={'b'} fontSize={'3xl'}>Total Time : </Text>
        
        
      </Box>


     
      <Box my={'5'} bg={'gray.200'} padding={'20'} overflow={'hidden'} rounded={'xl'} shadow={'dark-lg'}>
        <HStack justifyContent={"space-between"} mb={'12'} borderBottomWidth={2} borderBottomColor={'blackAlpha.300'}>
          <Text mb='1' as={'b'} fontSize={'xl'}> Add Subject </Text>
          <Box >
            
            <IconButton mb='1' colorScheme="green" icon={<MdAddCircle/>} onClick={() => setIsModalOpen(true)}>Add Todo</IconButton>
          </Box>
        </HStack>


      
      <List spacing={6}>
        {todos.map((todo) => (
          
            <ListItem key={todo.id} width={64}>
              <Box bg={'green.300'} overflow={'hidden'} rounded={'xl'} shadow={'lg'}>
                <HStack justifyContent={"space-between"} py={"5"} px={"5"}>

                {/* <Link to={'/details/${todo.id}'}> */}
                  <Text as={'b'} onClick={() => onClickList(todo.id,todo.title)}>{todo.title}</Text>
                {/* </Link> */}
                
                <IconButton colorScheme="red" size='lg' ml={2} onClick={() => handleDeleteTodo(todo.id)} icon={<MdDelete/>} />
                 
              

                </HStack>
                
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
    {/* </Box> */}


    </VStack>
    
  );
}

