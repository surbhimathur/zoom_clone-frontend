//all socket logic in this file

import React, { createContext, useEffect, useRef, useState } from "react";

import Peer from "simple-peer";
import { io } from "socket.io-client";

//for creating connection and communicating using socket.io 
const SocketContext = createContext();
const socket = io("https://videocity.herokuapp.com/");
const ContextProvider = ({ children }) => {
  const [stream, setStream] = useState();
  const [me, setMe] = useState("");
  const [call, setCall] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState("");
  const [myMicStatus, setMyMicStatus] = useState(true);
  const [myVdoStatus, setMyVdoStatus] = useState(true);
  const [userVdoStatus, setUserVdoStatus] = useState(true);
  const [userMicStatus, setUserMicStatus] = useState(true);
  const [otherUser, setOtherUser] = useState("");
  
  const myVideo = useRef();
  const userVideo = useRef();
  const connectionRef = useRef();
//retreiving current videostream and audiostream
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      });
      
    socket.on("me", (id) => setMe(id));
     socket.on("calluser", ({ from, name:callerName, signal }) => {
     setCall({ isReceivedCall: true, from, name:callerName, signal });
     });
     
     socket.on("endCall", () => {
      window.location.reload();
    });
    
     socket.on("updateUserMedia", ({ type, currentMediaStatus }) => {
      if (currentMediaStatus !== null || currentMediaStatus !== []) {
        switch (type) {
          case "video":
            setUserVdoStatus(currentMediaStatus);
            break;
          case "mic":
            setUserMicStatus(currentMediaStatus);
            break;
          default:
            setUserMicStatus(currentMediaStatus[0]);
            setUserVdoStatus(currentMediaStatus[1]);
            break;
        }
      }
    });
  }, []);
//answering call
  const answerCall = () => {
    setCallAccepted(true);
    setOtherUser(call.from);
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on("signal", (data) => {
      socket.emit("answercall", {
        signal: data,
        to: call.from,
        type: "both",
        myMediaStatus: [myMicStatus, myVdoStatus],
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    peer.signal(call.signal);

    connectionRef.current = peer;
  };
  
//making a call

  const callUser = (id) => {
    const peer = new Peer({ initiator: true, trickle: false, stream });
    setOtherUser(id);
    peer.on("signal", (data) => {
      socket.emit("calluser", {
        userToCall: id,
        signalData: data,
        from: me,
        name
      });
    });
    peer.on("stream", (currentStream) => {
      userVideo.current.srcObject = currentStream;
    });

    socket.on("callaccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
       socket.emit("updateMyMedia", {
        type: "both",
        currentMediaStatus: [myMicStatus, myVdoStatus],
       });
    });
    connectionRef.current = peer;
  };
//ending call
  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    socket.emit("endCall", { id: otherUser });
    window.location.reload();
  };
//updating current status of microphone(audio)
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

  
//updating current status of video

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
        setOtherUser
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
