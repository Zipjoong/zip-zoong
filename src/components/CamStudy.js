import { Box } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:1900";

function CamStudy() {
  const socketRef = useRef();
  const roomNameRef = useRef();
  const [isWelcome, setIsWelcome] = useState(true);
  const myFaceRef = useRef(null);
  const peerFaceRef = useRef(null);
  const camerasSelectRef = useRef(null);
  let myStream;
  let myPeerConnection;
  let roomName;

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL);
    console.log(socketRef);
  }, []);

  function handleIce(data) {
    console.log("sent candidate");
    socketRef.current.emit("ice", data.candidate, roomName);
  }

  function handleAddStream(data) {
    console.log("handleAddStream");
    // const peerFace = document.getElementById("peerFace");
    // peerFace.srcObject = data.stream;
    peerFaceRef.current.srcObject = data.stream;
  }

  function makeConnection() {
    myPeerConnection = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:stun1.l.google.com:19302",
            "stun:stun2.l.google.com:19302",
            "stun:stun3.l.google.com:19302",
            "stun:stun4.l.google.com:19302",
          ],
        },
      ],
    });
    myPeerConnection.addEventListener("icecandidate", handleIce);
    myPeerConnection.addEventListener("addstream", handleAddStream);
    myStream
      .getTracks()
      .forEach((track) => myPeerConnection.addTrack(track, myStream));
  }

  async function getCameras() {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cameras = devices.filter((device) => device.kind === "videoinput");
      const currentCamera = myStream.getVideoTracks()[0];
      cameras.forEach((camera) => {
        console.log(camera);
        const option = document.createElement("option");
        option.value = camera.deviceId;
        option.innerText = camera.label;
        if (currentCamera.label === camera.label) {
          option.selected = true;
        }
        camerasSelectRef.current.appendChild(option);
      });
    } catch (e) {
      console.log(e);
    }
  }

  async function getMedia(deviceId) {
    const initialConstrains = {
      audio: true,
      video: { facingMode: "user" },
    };
    const cameraConstraints = {
      audio: true,
      video: { deviceId: { exact: deviceId } },
    };
    try {
      myStream = await navigator.mediaDevices.getUserMedia(
        deviceId ? cameraConstraints : initialConstrains
      );
      myFaceRef.current.srcObject = myStream;
      if (!deviceId) {
        await getCameras();
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleCameraChange() {
    console.log("camera change");
    await getMedia(camerasSelectRef.current.value);
    if (myPeerConnection) {
      const videoTrack = myStream.getVideoTracks()[0];
      const videoSender = myPeerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video");
      videoSender.replaceTrack(videoTrack);
    }
  }

  async function initCall() {
    setIsWelcome((prev) => !prev);
    await getMedia();
    makeConnection();
  }

  const handleWelcomeSubmit = async (event) => {
    event.preventDefault();
    console.log("handle submit!");
    roomName = roomNameRef.current.value;
    console.log(roomName);
    await initCall();
    socketRef.current.emit("join_room", roomName);

    socketRef.current.on("welcome", async () => {
      const offer = await myPeerConnection.createOffer();
      myPeerConnection.setLocalDescription(offer);
      console.log("sent the offer");
      socketRef.current.emit("offer", offer, roomName);
    });

    socketRef.current.on("offer", async (offer) => {
      console.log("received the offer");
      myPeerConnection.setRemoteDescription(offer);
      const answer = await myPeerConnection.createAnswer();
      myPeerConnection.setLocalDescription(answer);
      socketRef.current.emit("answer", answer, roomName);
      console.log("sent the answer");
    });

    socketRef.current.on("answer", (answer) => {
      console.log("received the answer");
      myPeerConnection.setRemoteDescription(answer);
    });

    socketRef.current.on("ice", (ice) => {
      console.log("received candidate");
      myPeerConnection.addIceCandidate(ice);
    });
  };

  return (
    <Box>
      {/* <title>Noom</title> */}
      <link rel="stylesheet" href="https://unpkg.com/mvp.css" />
      {/* <header>
        <h1>Noom</h1>
      </header> */}
      <main>
        {isWelcome && (
          <div id="welcome">
            <form onSubmit={handleWelcomeSubmit}>
              <input
                placeholder="enter room name"
                required
                type="text"
                ref={roomNameRef}
              />
              <button>Enter room</button>
            </form>
          </div>
        )}
        {!isWelcome && (
          <div id="call">
            <div id="myStream">
              <video
                id="myFace"
                autoPlay
                playsInline
                width={400}
                height={400}
                ref={myFaceRef}
              />
              <button id="mute">Mute</button>
              <button id="camera">Turn Camera Off</button>
              <select
                id="cameras"
                ref={camerasSelectRef}
                onChange={handleCameraChange}
              />
              <video
                id="peerFace"
                autoPlay
                playsInline
                width={400}
                height={400}
                ref={peerFaceRef}
              />
            </div>
          </div>
        )}
      </main>
    </Box>
  );
}

export default CamStudy;
