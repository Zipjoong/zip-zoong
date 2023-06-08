import { Box, Button, Text, VStack } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { HStack } from "@chakra-ui/react";

function formatTime(time) {
  const hours = Math.floor(time / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((time % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (time % 60).toString().padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

function Stopwatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState();
  //console.log(tisRunning,"WHAT?")

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
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
      <Box>
        <Text as={"b"} color={"green.700"} fontSize={"3xl"}>
          {" "}
        </Text>
      </Box>

      <HStack justifyContent={"space-between"} py={"1"} px={"40"}>
        <Text color={"teal.400"} fontSize={"2xl"}>
          Time: {formatTime(time)}
        </Text>
      </HStack>

      <HStack borderBottomWidth={2} paddingBottom={5}>
        <Button colorScheme={"blue"} onClick={handleStart}>
          Start
        </Button>
        <Button colorScheme={"blue"} onClick={handlePause}>
          Pause
        </Button>
        <Button colorScheme={"blue"} onClick={handleReset}>
          Reset
        </Button>
      </HStack>
    </VStack>
  );
}

export default Stopwatch;
