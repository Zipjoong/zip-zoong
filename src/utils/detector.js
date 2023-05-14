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

  //변경된 코드
  setInterval(() => {
    detect(video, canvas, detector);
  }, 10);
};

const detect = async (video, canvas, net) => {
  const estimationConfig = { flipHorizontal: true };
  const faces = await net.estimateFaces(video, estimationConfig);
  // console.log(faces);
  const ctx = canvas.getContext("2d");
  requestAnimationFrame(() => drawMesh(faces[0], ctx));
};
