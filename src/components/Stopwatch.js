import { Button,Text, VStack} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { HStack } from '@chakra-ui/react';


function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <VStack spacing={4} py={"2"}>

      <HStack justifyContent={"space-between"} py={"2"} px={"40"} >
        
        <Text color={'teal.400'} fontSize={"2xl"}>Time: {time} seconds</Text>

      </HStack>

      <HStack borderBottomWidth={2} paddingBottom={5}>
        <Button colorScheme={'blue'} onClick={handleStart}>Start</Button>
        <Button colorScheme={'blue'} onClick={handlePause}>Pause</Button>
        <Button colorScheme={'blue'} onClick={handleReset}>Reset</Button>
      </HStack>

    </VStack>
    
  );
}

export default Stopwatch;