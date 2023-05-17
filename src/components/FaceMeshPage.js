import React, { useRef, useState, useEffect } from "react";
import "@tensorflow/tfjs";
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "../utils/detector";
import { Box } from "@chakra-ui/react";

const inputResolution = {
  width: 1080,
  height: 900,
};

const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};

const MAX_INACTIVE_TIME = 3000; // 일정 시간 (밀리초) 동안 비활성 상태로 판단합니다.
const CHECK_INTERVAL = 1000; // 체크 간격 (밀리초)

export default function FaceMeshPage() {
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [isFaceMeshActive, setIsFaceMeshActive] = useState(true);
  const [lastActiveTime, setLastActiveTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(checkFaceMeshActivity, CHECK_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const checkFaceMeshActivity = () => {
    if (Date.now() - lastActiveTime > MAX_INACTIVE_TIME) {
      setIsFaceMeshActive(false);
    } else {
      setIsFaceMeshActive(true);
    }
  };

  const handleVideoLoad = (videoNode) => {
    const video = videoNode.target;
    if (video.readyState !== 4) return;
    if (loaded) return;
    runDetector(video, canvasRef.current);
    setLoaded(true);
    setLastActiveTime(Date.now());
  };

  const canvasStyle = {
    position: "absolute",
    top: -60,
    left: 0,
    zIndex: 1,
  };

  return (
    <Box position="relative" width={inputResolution.width} height={inputResolution.height}>
      <Webcam
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ position: "absolute", top: 0, left: 0, zIndex: 0 }}
        videoConstraints={videoConstraints}
        onLoadedData={handleVideoLoad}
        mirrored={true}
        ref={webcamRef}
      />
      <canvas
        ref={canvasRef}
        width={inputResolution.width}
        height={inputResolution.height}
        style={canvasStyle}
      />
      {!isFaceMeshActive && <header>FaceMesh is inactive.</header>}
      {loaded ? <></> : <header>Loading...</header>}
    </Box>
  );
}
