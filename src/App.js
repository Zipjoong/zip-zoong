import React, { useRef, useState } from "react";
import "@tensorflow/tfjs";
// Register WebGL backend.
import "@tensorflow/tfjs-backend-webgl";
import "@mediapipe/face_mesh";
import Webcam from "react-webcam";
import { runDetector } from "./utils/detector";
import {Outlet} from "react-router-dom";

const inputResolution = {
  width: 1080,
  height: 900,
};

const videoConstraints = {
  width: inputResolution.width,
  height: inputResolution.height,
  facingMode: "user",
};

function App() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  const handleVideoLoad = (videoNode) => {
    console.log(videoNode); // videoNode는 onLoadedData를 통해 받아온 event  객체
    const video = videoNode.target; // 다음과 같이 onLoadedData 이벤트 핸들러 함수에서 target 프로퍼티를 활용하여 로드된 미디어 데이터를 참조할 수 있습니다.
    if (video.readyState !== 4) return; // video가 loaded 되지 않았을때 종료
    if (loaded) return; // loaded 되었으면 runDetector함수가 이미 실행 되었으므로 종료
    runDetector(video, canvasRef.current);
    setLoaded(true); // react-webcam이 loaded 되었다고 state를 변경함.
  };

  return (
    <><div>
      <Webcam
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ visibility: "hidden", position: "absolute" }} // webcam을 보고싶으면 hidden -> visible로 변경
        videoConstraints={videoConstraints}
        onLoadedData={handleVideoLoad}
        mirrored={true} />
      <canvas
        ref={canvasRef}
        width={inputResolution.width}
        height={inputResolution.height}
        style={{ position: "absolute" }} />
      {loaded ? <></> : <header>Loading...</header>}
    </div><div>
        <Outlet />
      </div></>
    
  
  );
}

export default App;
