import React, { useRef, useState } from "react";
import "@tensorflow/tfjs";
import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "../utils/drawMesh";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { useNavigate,Link } from "react-router-dom";


import { Box, VStack,Button } from "@chakra-ui/react";
import Stopwatch from "./Stopwatch";






const inputResolution = {
  width: 1080,
  height: 900,
};

const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};

export default function FaceMeshPage({title}) {
  const canvasRef = useRef(null);
  const webcamRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [reqID, setreqID] = useState(null);

  const [listtime, setlisttime] = useState('');
  const [FaceDetected, setFaceDetected] = useState(false);
  const [Subjecttitle, setSubjecttitle] = useState(title);

  const navigate = useNavigate();

  

  const handleGoBack = () => {
    setLoaded(false);
  
    // WebGL 컨텍스트 해제
    if (reqID) {
      cancelAnimationFrame(reqID);
      setreqID(null); // requestId 초기화
    }
  
    const gl = canvasRef.current.getContext("webgl");
    if (gl) {
      gl.getExtension("WEBGL_lose_context").loseContext();
      canvasRef.current.getContext("webgl", { preserveDrawingBuffer: true });
      canvasRef.current.getContext("webgl", { preserveDrawingBuffer: false });
    }
  
    // 페이지 이동
    navigate("/landing"); // 이동하고자 하는 경로로 수정해주세요
  };
  

  console.log(reqID,'tHiSTisi')
  
  const timef = (tt) => {
    console.log(tt,'hello');
    setlisttime(tt);
    console.log(listtime,'asdfasdf')
  
  };





  const runDetector = async (video, canvas) => {
    const model = faceLandmarksDetection.SupportedModels.MediaPipeFaceMesh;
    const detectorConfig = {
      runtime: "tfjs",
    };
    const detector = await faceLandmarksDetection.createDetector(
      model,
      detectorConfig
    );
  
    let noFaceDetected = false; // 얼굴이 감지되지 않는 상태를 나타내는 변수
  
    // 얼굴 감지 함수 호출을 위한 변수
    let detectionInterval;
    const detectionDelay = 3000; // 3초
  
    const detect = async () => {
      const estimationConfig = { flipHorizontal: true };
      const faces = await detector.estimateFaces(video, estimationConfig);
  
      if (faces.length === 0) {
        noFaceDetected = true;
      } else {
        noFaceDetected = false;
      }
  
      const ctx = canvas.getContext("2d");
      requestAnimationFrame(() => drawMesh(faces[0], ctx));
      //console.log(requestAnimationFrame(() => drawMesh(faces[0], ctx)),'asdfasdfasdfasdfasfqreerwrwe')
      setreqID(requestAnimationFrame(() => drawMesh(faces[0], ctx)));


    };
  
    // 주기적인 얼굴 감지 호출 설정
    const startDetection = () => {
      detect(); // 최초 호출
      detectionInterval = setInterval(detect, 10);
    };
  
    // 3초 동안 얼굴이 감지되지 않으면 noFaceDetected를 true로 설정
    setTimeout(() => {
      noFaceDetected = true;
    }, detectionDelay);
  
    startDetection(); // 얼굴 감지 시작
  
    // 3초 이상 얼굴이 감지되지 않는 경우를 확인
    const checkNoFaceDetected = () => {
      if (noFaceDetected) {
        //console.log("No face detected for 3 seconds or more");
        setFaceDetected(true);
        
      } else {
        //console.log("Face detected");
        setFaceDetected(false);
        // 얼굴 감지
      }
    };
  
    // 일정한 간격으로 얼굴 감지 여부 확인
    setInterval(checkNoFaceDetected, detectionDelay);
  };


  
  



  

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
    <VStack>
      <Box>
        <Stopwatch timef={timef} tisRunning={!FaceDetected} subtitle={Subjecttitle} />
      </Box>


{/* 
        {loaded ? } */}
        <Box position="relative" width={inputResolution.width} height={inputResolution.height}>
          <Webcam
            width={inputResolution.width }
            height={inputResolution.height }
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
      
      <Box>
        
        <Button onClick={() =>handleGoBack()}> TTTTTTTTTTTTTTTTtTodoListPage</Button>
      </Box>

    </VStack>

    
  );
}

 
