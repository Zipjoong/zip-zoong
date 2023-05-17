import * as faceLandmarksDetection from "@tensorflow-models/face-landmarks-detection";
import { drawMesh } from "./drawMesh";

export const runDetector = async (video, canvas) => {
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
      console.log("No face detected for 3 seconds or more");
      
    } else {
      console.log("Face detected");
      // 얼굴 감지
    }
  };

  // 일정한 간격으로 얼굴 감지 여부 확인
  setInterval(checkNoFaceDetected, detectionDelay);
};

