import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import { Box, Button, VStack, Text } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { fireStore } from "../firbase";

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

function NewHoli({ subjecttitle, docid }) {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const [FaceDetected, setFaceDetected] = useState(false);
  const [isRunning, setIsRunning] = useState(false); // 처음 부터 타이머 시작할거면 초기값 true로 변경 ㅍ필요
  const [time, setTime] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  console.log(subjecttitle, "from testdetailpage");

  console.log(docid, "from docid dsds");

  function onResultsHolistic(results) {
    if (!webcamRef.current) return;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    setFaceDetected(results["faceLandmarks"] === undefined ? true : false);
  }

  useEffect(() => {
    const holisticModel = new Holistic({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`,
    });

    holisticModel.setOptions({
      upperBodyOnly: false,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    holisticModel.onResults(onResultsHolistic);

    if (webcamRef.current) {
      const camera = new cam.Camera(webcamRef.current.video, {
        onFrame: async () => {
          if (!holisticModel) return;
          if (!webcamRef.current) return;

          await holisticModel.send({ image: webcamRef.current.video });
        },
        width: 640,
        height: 480,
      });
      camera.start();
      cameraRef.current = camera;
    }

    return () => {
      if (holisticModel) {
        holisticModel.close();
      }
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
    };
  }, []);

  const handleButtonClick = () => {
    if (cameraRef.current) {
      cameraRef.current.stop(); // 카메라 중지
    }
    ///////////////////////////////////////////////
    //여기에 종료 시간 Records에 업데이트 해야함
    updateDoc(doc(fireStore, "STUDY_RECORDS", docid), {
      end_time: serverTimestamp(),
    });
  };
  ////// 여기 훅은 FaceDetected 체크용  ////////////////
  useEffect(() => {
    console.log(FaceDetected);
  }, [FaceDetected]);
  //////////////////////////////////////////////////
  useEffect(() => {
    let interval = null;
    console.log("asdf");
    console.log(isRunning);
    console.log(!FaceDetected, "aFace");

    if (isRunning && !FaceDetected) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning, FaceDetected]);

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
    <VStack>
      <Box>
        <Webcam ref={webcamRef} />
        <Text>Elapsed Time: {formatTime(time)}</Text>

        <Button onClick={handleStart}>Start</Button>
        <Button onClick={handlePause}>Pause</Button>
        <Button onClick={handleReset}>Reset</Button>
        <Link to="/todo">
          <Button onClick={handleButtonClick}>Go Back to Todo List Page</Button>
        </Link>
      </Box>
      <Box>
        <Text>{subjecttitle}</Text>
      </Box>
    </VStack>
  );
}

export default NewHoli;
