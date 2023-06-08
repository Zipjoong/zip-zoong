import React, { useState, useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import { Box, Button, VStack, Text, HStack } from "@chakra-ui/react";
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

function turtleDetection(
  HolisticDetectionResults,
  { width: videoWidth, height: videoHeight }
) {
  const height = videoHeight;
  const width = videoWidth;

  const results = HolisticDetectionResults;
  var chin_to_shoulder_length = null;
  if (results.faceLandmarks && results.poseLandmarks) {
    //얼굴이 나와야 실행되는 코드
    const chin_y = results.faceLandmarks[152].y * height;
    const left_shoulder_y = results.poseLandmarks[11].y * height;
    const right_shoulder_y = results.poseLandmarks[12].y * height;
    const shoulder_y = (left_shoulder_y + right_shoulder_y) / 2;
    chin_to_shoulder_length = Math.abs(chin_y - shoulder_y);
    console.log("chin_to_shoulder_length", chin_to_shoulder_length);
  } else {
    console.log("no face & shoulder");
  }

  return chin_to_shoulder_length;
}

function NewHoli({ subjecttitle, docid }) {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);
  const [FaceDetected, setFaceDetected] = useState(false);
  const [isRunning, setIsRunning] = useState(true); // 처음 부터 타이머 시작할거면 초기값 true로 변경 ㅍ필요
  const [time, setTime] = useState(0);
  const [earRight, setEarRight] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // console.log(subjecttitle, "from testdetailpage");
  // console.log(docid, "from docid dsds");

  //for 거북목
  var goodLengthList = [];
  var isTurtleDetected = false;
  const audio = new Audio("/sound/sound_ex.wav");
  ////

  function eyeclosed(results, videox, videoy) {
    let rp26;
    let rp35;
    let rp14;
    let reyeEAR;

    rp26 = Math.abs(
      results.faceLandmarks[144].y * videoy -
        results.faceLandmarks[160].y * videoy
    );
    rp35 = Math.abs(
      results.faceLandmarks[145].y * videoy -
        results.faceLandmarks[159].y * videoy
    );

    rp14 = Math.abs(
      results.faceLandmarks[133].x * videox -
        results.faceLandmarks[33].x * videox
    );

    reyeEAR = (rp26 + rp35) / (2 * rp14);

    //console.log(reyeEAR, "HELLLO!@", Date.now(), Date());
    if (reyeEAR < 0.2) {
      //console.log("CLLLLLLLLLOOOOOOOOOOSE");
      setEarRight(true);
    } else {
      setEarRight(false);
    }
  }

  function onResultsHolistic(results) {
    if (!webcamRef.current) return;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;
    if (results["faceLandmarks"]) {
      eyeclosed(results, videoWidth, videoHeight);
    }

    setFaceDetected(results["faceLandmarks"] === undefined ? true : false);
    if (isTurtleDetected == false) {
      const v = turtleDetection(results, {
        width: videoWidth,
        height: videoHeight,
      });
      if (v != -1) {
        goodLengthList.push(v);
        console.log("값 넣음", goodLengthList.length);
      }
      if (goodLengthList.length >= 60) {
        // goodLengthList 정리
        console.log("60!");
        goodLengthList = goodLengthList.slice(10);
        isTurtleDetected = true;
      }
    } else {
      // console.log("now.. just run");
      const v = turtleDetection(results, {
        width: videoWidth,
        height: videoHeight,
      });

      let sum = goodLengthList.reduce(
        (acc, currentValue) => acc + currentValue,
        0
      );
      let average = sum / goodLengthList.length;

      if (v < average * 0.93) {
        console.log("거북목입니당");
        audio.play();
      } else {
        console.log("측정시작");
        audio.pause();
      }
    }
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
      real_study_time: time,
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

    if (isRunning && !FaceDetected && !earRight) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval);
    };
  }, [isRunning, FaceDetected, earRight]);

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
        <Text fontSize={"6xl"} as={"b"}>
          {subjecttitle}
        </Text>
      </Box>
      <Box alignContent={"center"}>
        <Text fontSize={"4xl"} as={"b"}>
          측정시간: {formatTime(time)}
        </Text>
      </Box>
      <Box>
        <Webcam ref={webcamRef} />
      </Box>
      <HStack padding={"3"}>
        <Button onClick={handleStart} colorScheme="blue">
          Start
        </Button>
        <Button onClick={handlePause} colorScheme="blue">
          Pause
        </Button>
        <Button onClick={handleReset}>Reset</Button>
      </HStack>
      <Box>
        <Link to="/todo">
          <Button
            onClick={handleButtonClick}
            size="lg"
            colorScheme="blue"
            variant="solid"
          >
            Go Back to Todo List Page
          </Button>
        </Link>
      </Box>
    </VStack>
  );
}

export default NewHoli;
