import { useParams } from "react-router-dom";
import { Box, Text } from "@chakra-ui/react";


function TodoDetailsPage() {
  const { Uid } = useParams();

  // todos 배열에서 id에 해당하는 Todo 항목을 찾는 로직 구현
  // const todo = todos.find((todo) => todo.id === parseInt(id));

  return (
    <Box p={4}>
      <Text>{Uid} nell</Text>
      <Text>WWWWWWWWWWWWWWWWW</Text>
      {/* <Text>{todo ? todo.title : "Todo not found"}</Text> */}
    </Box>
  );
}
export default TodoDetailsPage;