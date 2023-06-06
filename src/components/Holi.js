import React, { useEffect, useRef } from "react";
import Webcam from "react-webcam";
import { Holistic } from "@mediapipe/holistic";
import * as cam from "@mediapipe/camera_utils";
import { Box, Button } from "@chakra-ui/react";
import { Link } from "react-router-dom";

function NewHoli() {
  const webcamRef = useRef(null);
  const cameraRef = useRef(null);

  function onResultsHolistic(results) {
    if (!webcamRef.current) return;
    const videoWidth = webcamRef.current.video.videoWidth;
    const videoHeight = webcamRef.current.video.videoHeight;

    // todo: canvas 그리기

    console.log(results["faceLandmarks"]);
    //results;
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
      // clean-up 함수에서 이벤트 리스너 제거 및 카메라 중지
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
  };

  return (
    <Box>
      <Webcam ref={webcamRef} />
      <Link to="/todo">
        <Button onClick={handleButtonClick}>Go Back to Todo List Page</Button>
      </Link>
    </Box>
  );
}

export default NewHoli;
