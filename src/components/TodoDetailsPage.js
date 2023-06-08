// TodoDetailsPage
import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Box, VStack, Button } from "@chakra-ui/react";
import NewHoli from "./Holi";

function TodoDetailsPage() {
  const { state } = useLocation();
  const title = state && state.title;
  const docid = state.docid;
  const previousPage = state && state.previousPage;
  const navigate = useNavigate();

  const goBack = () => {
    navigate(`/todo`);
  };

  return (
    <VStack>
      <Box p={4}>
        <Box
          my={5}
          bg="gray.200"
          padding={20}
          overflow="hidden"
          rounded="xl"
          shadow="dark-lg"
        >
          <NewHoli subjecttitle={title} docid={docid} />
        </Box>
      </Box>
    </VStack>
  );
}

export default TodoDetailsPage;
