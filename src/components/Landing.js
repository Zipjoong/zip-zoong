import { Card, CardHeader, CardBody, CardFooter } from "@chakra-ui/react";
import { Box, Grid, Heading, Text, Button, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";

export default function Landing() {
  return (
    // <Center>
    <Box>
      <Grid py={10} px={40} columnGap={10} templateColumns={"repeat(3,1fr)"}>
        <Card
          align="center"
          variant={"filled"}
          padding={10}
          shadow={"dark-lg"}
          bg={"gray.200"}
        >
          <CardHeader>
            <Heading size="lg"> Check Your Study Time </Heading>
          </CardHeader>
          <CardBody>
            <Text>
              FaceMesh를 사용하여 보다 정확한 집중시간을 측정해보세요!
            </Text>
          </CardBody>
          <CardFooter>
            <Link to="/todo">
              <Button align="center" shadow={"xl"} colorScheme="green">
                Start
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card
          align="center"
          variant={"filled"}
          padding={10}
          shadow={"dark-lg"}
          bg={"gray.200"}
        >
          <CardHeader>
            <Heading size="lg"> CamStudy</Heading>
          </CardHeader>
          <CardBody>
            <Text>다른 사용자들과 함께 공부해보는건 어떨까요?</Text>
          </CardBody>
          <CardFooter align="center">
            <Link to="/cam-study">
              <Button align="center" shadow={"xl"} colorScheme="green">
                Start
              </Button>
            </Link>
          </CardFooter>
        </Card>
        <Card
          align="center"
          variant={"filled"}
          padding={10}
          shadow={"dark-lg"}
          bg={"gray.200"}
        >
          <CardHeader>
            <Heading size="lg"> Dashboard</Heading>
          </CardHeader>
          <CardBody>
            <Text>TBD</Text>
          </CardBody>
          <CardFooter>
            <Link to="/chart">
              <Button align="center" shadow={"xl"} colorScheme="green">
                Start
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </Grid>
    </Box>

    // </Center>
  );
}
