//all socket logic in this file

import React, { createContext, useEffect, useRef, useState } from "react";

import Peer from "simple-peer";
import { io } from "socket.io-client";

const SocketContext = createContext();
const socket = io("http://localhost:5000");
const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState("");
  const [call, setCall] = useState(null);
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [myVdoStatus, setMyVdoStatus] = useState(true);
  const [userVdoStatus, setUserVdoStatus] = useState(true);
  const [userMicStatus, setUserMicStatus] = useState(true);

  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
    socket.on("me", (id) => setMe(id));
    // socket.on("calluser", ({ from, name, signal }) => {
    //   setCall({ isReceivedCall: true, from, name, signal });
    // });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    console.log("answercall . from h", call?.from);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", {
        signal: data,
        to: call.from,
        userName: name,
        type: "both",
        myMediaStatus: [myMicStatus, myVdoStatus],
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
      console.log(currentStream);
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name,
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", ({ signal, userName }) => {
      setCallAccepted(true);
      console.log("callaccepted signal", signal);
      console.log("callaccpeted username", userName);
      peer.signal(signal);
      socket.emit("updateMyMedia", {
        type: "both",
        currentMediaStatus: [myMicStatus, myVdoStatus],
      });
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  const updateMic = () => {
    setMyMicStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "mic",
        currentMediaStatus: !currentStatus,
      });
      stream.getAudioTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };

  const updateVideo = () => {
    setMyVdoStatus((currentStatus) => {
      socket.emit("updateMyMedia", {
        type: "video",
        currentMediaStatus: !currentStatus,
      });
      stream.getVideoTracks()[0].enabled = !currentStatus;
      return !currentStatus;
    });
  };
  return (
    <SocketContext.Provider
      value={{
        call,
        callAccepted,
        myVideo,
        userVideo,
        stream,
        name,
        setName,
        callEnded,
        me,
        callUser,
        leaveCall,
        answerCall,
        updateMic,
        myMicStatus,
        updateVideo,
        myVdoStatus,
        userVdoStatus,
        userMicStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
