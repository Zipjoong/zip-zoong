import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  Heading,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { RiCameraLensLine } from "react-icons/ri";
import {
  firebaseAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../firbase";
import { getAuth, signOut } from "firebase/auth";

import NewHoli from "./Holi";

//import CallToActionWithAnnotation from "./Main";

export default function Test() {
  //const {isOpen,onClose,onOpen} = useDisclosure();
  const modal1 = useDisclosure();
  const modal2 = useDisclosure();

  const nav = useNavigate();

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [User, setUser] = useState("");
  const [IsAppropriate, setIsAppropriate] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  const login = async () => {
    try {
      const curUserInfo = await signInWithEmailAndPassword(
        firebaseAuth,
        loginEmail,
        loginPassword
      );
      console.log(curUserInfo);
      setUser(curUserInfo.user);
      modal2.onClose();
      nav("/landing");
    } catch (err) {
      setIsAppropriate(false);
      // console.log(err.code);
      /*
      입력한 아이디가 없을 경우 : auth/user-not-found.
      비밀번호가 잘못된 경우 : auth/wrong-password.
      */
    }
  };

  const logout = () => {
    const auth = getAuth();
    auth.signOut();
    setUser();
    nav("/");
  };
  const auth = getAuth();
  const user = auth.currentUser;

  // console.log(IsAppropriate);
  return (
    <Box>
      <HStack
        justifyContent={"space-between"}
        py={"5"}
        px={"40"}
        borderBottomWidth={1}
        bg={"orange.200"}
        shadow={"dark-lg"}
      >
        <Box color={"green.500"}>
          <RiCameraLensLine size={"48"} />
        </Box>

        <Text color={"yellow.500"} fontSize={"6xl"}>
          ZipZoong
          {/* <Outlet/> */}
        </Text>

        <HStack spacing={2}>
          {/* <Button color={"green.500"} onClick={modal1.onOpen}>
            Sign up
          </Button> */}
          {user ? (
            <Button colorScheme={"green"} onClick={logout}>
              Log out
            </Button>
          ) : (
            // <Button colorScheme={"green"} onClick={modal2.onOpen}>
            //   Log in
            // </Button>
            <Box></Box>
          )}
        </HStack>

        <Modal onClose={modal1.onClose} isOpen={modal1.isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Signup</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Input
                  variant={"filled"}
                  placeholder="Username"
                  onChange={(event) => setRegisterEmail(event.target.value)}
                />
                <Input
                  variant={"filled"}
                  placeholder="Passward"
                  onChange={(event) => setRegisterPassword(event.target.value)}
                />
              </VStack>
            </ModalBody>
            {/* <ModalFooter>
              <Button w={"100%"} colorScheme="red" onClick={register}>
                SignUp
              </Button>
            </ModalFooter> */}
          </ModalContent>
        </Modal>

        <Modal onClose={modal2.onClose} isOpen={modal2.isOpen}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Login</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack>
                <Input
                  variant={"filled"}
                  placeholder="Username"
                  onChange={(event) => setLoginEmail(event.target.value)}
                />
                <Input
                  variant={"filled"}
                  placeholder="Passward"
                  onChange={(event) => setLoginPassword(event.target.value)}
                />
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button w={"100%"} colorScheme="red" onClick={login}>
                Login
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </HStack>

      {/* <Box bg={"orange.100"}>
        <NewHoli />
      </Box> */}

      <Box bg={"orange.100"}>
        {user ? <Outlet /> : <CallToActionWithAnnotation />}
      </Box>
    </Box>
  );
}

export function CallToActionWithAnnotation() {
  const modal1 = useDisclosure();
  const modal2 = useDisclosure();
  const toast = useToast();

  const nav = useNavigate();

  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [User, setUser] = useState("");
  const [IsAppropriate, setIsAppropriate] = useState();
  const [errorMsg, setErrorMsg] = useState("");

  // `회원가입` 버튼의 onClick에 할당
  const register = async () => {
    try {
      setErrorMsg("　");
      const createdUser = await createUserWithEmailAndPassword(
        firebaseAuth,
        registerEmail,
        registerPassword
      );
      console.log(createdUser);
      toast({
        title: "성공",
        description: "회원가입이 완료되었습니다!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      modal1.onClose();
    } catch (err) {
      console.log(err.code);
      switch (err.code) {
        case "auth/weak-password":
          setErrorMsg("비밀번호는 6자리 이상이어야 합니다");
          toast({
            title: "에러",
            description: "비밀번호는 6자리 이상이어야 합니다",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          break;
        case "auth/invalid-email":
          setErrorMsg("잘못된 이메일 주소입니다");
          toast({
            title: "에러",
            description: "잘못된 이메일 주소입니다",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          break;
        case "auth/email-already-in-use":
          setErrorMsg("이미 가입되어 있는 계정입니다");
          toast({
            title: "에러",
            description: "이미 가입되어 있는 계정입니다",
            status: "error",
            duration: 5000,
            isClosable: true,
          });
          break;
      }
    }
  };

  const login = async () => {
    try {
      const curUserInfo = await signInWithEmailAndPassword(
        firebaseAuth,
        loginEmail,
        loginPassword
      );
      console.log(curUserInfo);
      setUser(curUserInfo.user);
      modal2.onClose();

      nav("/landing");
    } catch (err) {
      setIsAppropriate(false);
      console.log(err.code);

      switch (err.code) {
        case "auth/user-not-found":
          setErrorMsg("존재하지 않는 ID입니다");
          toast({
            title: "에러",
            description: "존재하지 않는 ID입니다",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
          break;
        case "auth/wrong-password":
          toast({
            title: "에러",
            description: "잘못된 비밀번호 입니다.",
            status: "error",
            duration: 2000,
            isClosable: true,
          });
          break;
      }

      /*
      입력한 아이디가 없을 경우 : auth/user-not-found.
      비밀번호가 잘못된 경우 : auth/wrong-password.
      */
    }
  };

  const logout = () => {
    const auth = getAuth();
    auth.signOut();
    setUser();
    nav("/");
  };

  return (
    <>
      <Container maxW={"3xl"}>
        <Stack
          as={Box}
          textAlign={"center"}
          spacing={{ base: 8, md: 14 }}
          py={{ base: 20, md: 36 }}
        >
          <Heading
            fontWeight={600}
            fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
            lineHeight={"110%"}
          >
            Make money from <br />
            <Text as={"span"} color={"green.400"}>
              your audience
            </Text>
          </Heading>
          <Text color={"gray.500"}>
            Monetize your content by charging your most loyal readers and reward
            them loyalty points. Give back to your loyal readers by granting
            them access to your pre-releases and sneak-peaks.
          </Text>
          <Stack
            direction={"column"}
            spacing={3}
            align={"center"}
            alignSelf={"center"}
            position={"relative"}
          >
            <Button
              onClick={modal2.onOpen}
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "green.500",
              }}
            >
              Log in
            </Button>
            <Button
              onClick={modal1.onOpen}
              colorScheme={"green"}
              bg={"green.400"}
              rounded={"full"}
              px={6}
              _hover={{
                bg: "green.500",
              }}
            >
              Sign up
            </Button>

            <Modal onClose={modal1.onClose} isOpen={modal1.isOpen}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Signup</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack>
                    <Input
                      variant={"filled"}
                      placeholder="Username"
                      onChange={(event) => setRegisterEmail(event.target.value)}
                    />
                    <Input
                      type="password"
                      variant={"filled"}
                      placeholder="Password"
                      onChange={(event) =>
                        setRegisterPassword(event.target.value)
                      }
                    />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button w={"100%"} colorScheme="red" onClick={register}>
                    SignUp
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>

            <Modal onClose={modal2.onClose} isOpen={modal2.isOpen}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Login</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <VStack>
                    <Input
                      variant={"filled"}
                      placeholder="Username"
                      onChange={(event) => setLoginEmail(event.target.value)}
                    />
                    <Input
                      type="password"
                      variant={"filled"}
                      placeholder="Password"
                      onChange={(event) => setLoginPassword(event.target.value)}
                    />
                  </VStack>
                </ModalBody>
                <ModalFooter>
                  <Button w={"100%"} colorScheme="red" onClick={login}>
                    Login
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Stack>
        </Stack>
      </Container>
    </>
  );
}
