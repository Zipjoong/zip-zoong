import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  HStack,
  Flex,
} from "@chakra-ui/react";
import { Box, Grid, Heading, Text, Button, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    // <Center>
    <Flex justify="space-between" alignItems="center" px={30} py={20}>
      {/* <Grid py={30} px={40} columnGap={10} templateColumns={"repeat(3,1fr)"}> */}
      <Box w="33%" p={4}>
        <Card
          height={"400"}
          align="center"
          variant={"filled"}
          padding={10}
          shadow={"dark-lg"}
          bg={"gray.200"}
        >
          <CardHeader>
            <Heading size="lg"> 시간 측정 </Heading>
          </CardHeader>
          <CardBody>
            <Text>
              {/* FaceMesh를 사용하여 보다 정확한 집중시간을 측정해보세요!
              <br /> */}
              자리비움과 눈을감을 경우 시간을 멈추고, 거북목이 발생할 경우
              소리와 문구로 알려드려요.
            </Text>
          </CardBody>
          <CardFooter>
            <Link to="/todo">
              <Button align="center" shadow={"xl"} colorScheme="blue">
                시작
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Box>
      <Box w="33%" p={4}>
        <Card
          height={"400"}
          align="center"
          variant={"filled"}
          padding={10}
          shadow={"dark-lg"}
          bg={"gray.200"}
        >
          <CardHeader>
            <Heading size="lg"> 캠스터디</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              다른 사용자들과 함께 공부해보는건 어떨까요?
              <br />방 번호를 입력하고 입장해보세요!
            </Text>
          </CardBody>
          <CardFooter align="center">
            <Link to="/cam-study">
              <Button align="center" shadow={"xl"} colorScheme="blue">
                시작
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Box>
      <Box w="33%" p={4}>
        <Card
          height={"400"}
          align="center"
          variant={"filled"}
          padding={10}
          shadow={"dark-lg"}
          bg={"gray.200"}
        >
          <CardHeader>
            <Heading size="lg"> 기록통계</Heading>
          </CardHeader>
          <CardBody>
            <Text>
              공부기록을 달력과 차트 형식으로 확인해보세요 !<br />
            </Text>
          </CardBody>
          <CardFooter>
            <Link to="/calendar">
              <Button align="center" shadow={"xl"} colorScheme="blue">
                시작
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Box>
      {/* </Grid> */}
    </Flex>

    // </Center>
  );
}
