import React, { useRef, useState } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
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

export default function FaceMeshPage() {
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);


  

  const handleVideoLoad = (videoNode) => {
    console.log(videoNode); // videoNode는 onLoadedData를 통해 받아온 event  객체
    const video = videoNode.target; // 다음과 같이 onLoadedData 이벤트 핸들러 함수에서 target 프로퍼티를 활용하여 로드된 미디어 데이터를 참조할 수 있습니다.
    if (video.readyState !== 4) return; // video가 loaded 되지 않았을때 종료
    if (loaded) return; // loaded 되었으면 runDetector함수가 이미 실행 되었으므로 종료
    runDetector(video, canvasRef.current);
    setLoaded(true); // react-webcam이 loaded 되었다고 state를 변경함.
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
      {loaded ? <></> : <header>Loading...</header>}
    </Box>
  );
}

 
