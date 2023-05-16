import {Outlet} from "react-router-dom";
import {Box, Button, HStack, Text} from "@chakra-ui/react";
import {RiCameraLensLine} from "react-icons/ri";

export default function Test() {
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
        <Button color={"green.500"}>Log in</Button>
        <Button colorScheme={"green"}>Sign up</Button>
      </HStack>

      

    </HStack>
    <Box bg={'orange.100'}>
    <Outlet/>
    </Box>
    
    
    
    </Box>
    
  );
}