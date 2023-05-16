import React from "react";
import { useParams , useLocation} from "react-router-dom";
import { Box, Center, Text, VStack } from "@chakra-ui/react";
import FaceMeshPage from "./FaceMeshPage";
import Stopwatch from "./Stopwatch";

function TodoDetailsPage() {
  const { Uid } = useParams();
  const { state } = useLocation();
  const title = state && state.title;



  

  return (
    <VStack >
      <Box p={4}>
      {/* <Text>{Uid} nell</Text> */}
      <Center>
      <Text as={'b'} color={'green.700'} fontSize={"3xl"}>{title}</Text>
      </Center>
        
        <Box>
          <Stopwatch />
        </Box>
      <Box my={5} bg="green.200" padding={20} overflow="hidden" rounded="xl" shadow="dark-lg">
        {/* <FaceMeshPage /> */}
      </Box>
      </Box>


    </VStack>
    
  );
}

export default TodoDetailsPage;
