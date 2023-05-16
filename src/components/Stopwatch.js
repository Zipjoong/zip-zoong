import { Button,Text} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';


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
    <div>
      <Text color={"blue.500"} fontSize={"4xl"}>Stopwatch</Text>
      <Text color={'pink.300'} fontSize={"2xl"}>Time: {time} seconds</Text>
      {/* <button onClick={handleStart}>Start</button>
      <button onClick={handlePause}>Pause</button>
      <button onClick={handleReset}>Reset</button> */}
      <Button colorScheme={'blue'} onClick={handleStart}>Start</Button>
      <Button colorScheme={'blue'} onClick={handlePause}>Pause</Button>
      <Button colorScheme={'blue'} onClick={handleReset}>Reset</Button>

    </div>
  );
}

export default Stopwatch;