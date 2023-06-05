import { Outlet, useNavigate} from "react-router-dom";
import { useState } from "react";
import {Box, Button, HStack, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, VStack, useDisclosure} from "@chakra-ui/react";
import {RiCameraLensLine} from "react-icons/ri";
import { firebaseAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword } from "../firbase";
import { getAuth,signOut } from "firebase/auth";



export default function Test() {
  //const {isOpen,onClose,onOpen} = useDisclosure();
  const modal1 =useDisclosure();
  const modal2 = useDisclosure();

  const nav = useNavigate();

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [User, setUser] = useState("");
  const [IsAppropriate, setIsAppropriate] = useState();
  const [errorMsg, setErrorMsg] = useState("");


  console.log(User.uid);
  
  

  // `회원가입` 버튼의 onClick에 할당
  const register = async () => {
    try {
      setErrorMsg('　');
      const createdUser = await createUserWithEmailAndPassword(firebaseAuth, registerEmail, registerPassword);
      console.log(createdUser);
     
    } catch(err){
      console.log(err.code);
      switch (err.code) {
        case 'auth/weak-password':
          setErrorMsg('비밀번호는 6자리 이상이어야 합니다');
          break;
        case 'auth/invalid-email':
          setErrorMsg('잘못된 이메일 주소입니다');
          break;
        case 'auth/email-already-in-use':
          setErrorMsg('이미 가입되어 있는 계정입니다');
          break;
      }
    }
  }

  const login = async () => {
    try {
      const curUserInfo = await signInWithEmailAndPassword(firebaseAuth, loginEmail, loginPassword);
      console.log(curUserInfo);
      setUser(curUserInfo.user);
    } catch(err){
      setIsAppropriate(false);
      // console.log(err.code);
      /*
      입력한 아이디가 없을 경우 : auth/user-not-found.
      비밀번호가 잘못된 경우 : auth/wrong-password.
      */
    }
  }


  const logout = () => {
    const auth = getAuth();
    auth.signOut();
    setUser()
    nav('/')
  }

  console.log(User)
  // console.log(IsAppropriate);
  return (
  
  <Box>
    <HStack justifyContent={"space-between"} py={"5"} px={"40"} borderBottomWidth={1} bg={'orange.200'} shadow={'dark-lg'}>
      <Box color={"green.500"}>
        <RiCameraLensLine size={"48"} />
      </Box>

      <Text color={"yellow.500"} fontSize={"6xl"} >
        ZipZoong 
        
        {/* <Outlet/> */}
      
      </Text>
      
      <HStack spacing={2}>
        <Button color={"green.500"} onClick={modal1.onOpen}>Sign up</Button>
        {User?(
          <Button colorScheme={"green"} onClick={logout}>Log out</Button>
        ):(
          <Button colorScheme={"green"} onClick={modal2.onOpen}>Log in</Button>
        ) }
        
      </HStack>

      <Modal onClose={modal1.onClose} isOpen={modal1.isOpen}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Signup</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <VStack>
              <Input variant={'filled'} placeholder="Username" onChange={ (event) => setRegisterEmail(event.target.value) }/>
              <Input variant={'filled'} placeholder="Passward" onChange={ (event) => setRegisterPassword(event.target.value) }/>
              
            </VStack>

          </ModalBody>
          <ModalFooter>
            <Button w={'100%'} colorScheme="red" onClick={register}>SignUp</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>


      <Modal onClose={modal2.onClose} isOpen={modal2.isOpen}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Login</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <VStack>
              <Input variant={'filled'} placeholder="Username" onChange={ (event) => setLoginEmail(event.target.value) }/>
              <Input variant={'filled'} placeholder="Passward" onChange={ (event) => setLoginPassword(event.target.value) }/>
              
            </VStack>

          </ModalBody>
          <ModalFooter>
            <Button w={'100%'} colorScheme="red" onClick={login}>Login</Button>
          </ModalFooter>
        </ModalContent>

      </Modal>

      

    </HStack>
    <Box bg={'orange.100'}>
    <Outlet/>
    </Box>
    
    
    
    </Box>
    
  );
}