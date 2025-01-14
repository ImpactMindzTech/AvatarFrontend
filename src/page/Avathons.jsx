import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

import { useParams } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import Images from "@/constant/Images";
import { Toaster, toast } from "react-hot-toast";

import { useDispatch } from "react-redux";

import { getmeetdata, useravathonApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useNavigate } from "react-router-dom";

import moment from 'moment-timezone';
import { useLocation } from "react-router-dom";


// Replace with your ngrok URL or server URL
const SOCKET_SERVER_URL="http://localhost:3000/"
//const SOCKET_SERVER_URL = 'https://avatarbackend-4v41.onrender.com/';
const socket = io(SOCKET_SERVER_URL,{
  withCredentials: true,
  reconnectionAttempts: 5,
  transports: ['websocket'],
  secure: true,
  reconnectionDelay: 1000,   // Start with 1 second delay
  reconnectionDelayMax: 5000,
  autoConnect: true
});
const Avathons = () => {
  const location = useLocation();
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const emojis = ['❤️', '😂', '👍', '👏', '😮'];
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState([]);
  const [newOption, setNewOption] = useState("");
const[viewpoll,setuserpoll] = useState(null);
  const [avtTimezone, setTimezone] = useState(null);
  const [videoDevices, setVideoDevices] = useState([]);
  const [selectedCameraId, setSelectedCameraId] = useState('');
  const localVideoRef = useRef(null);
  const dispatch = useDispatch();
  const [remain, setremain] = useState();
  const videosContainerRef = useRef(null);
  const [joinId, setJoinId] = useState("");
  const [viewers, setViewers] = useState(0);
  const [roomId, setRoomId] = useState("");
  const [duration, setduration] = useState(0);
  const [localStream, setLocalStream] = useState(null);
  const [peerConnections, setPeerConnections] = useState({});
  const [isBroadcaster, setIsBroadcaster] = useState(false);
  const [messages, setMessages] = useState([]);
  const [reactions, setReaction] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [showAddMoreTimeModal, setShowAddMoreTimeModal] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [meetdata, setdata] = useState(null);
  const [type, settype] = useState(null);
  const params = useParams();
const [poll,setpoll] = useState(false);
  const navigate = useNavigate();
  const [viewerTimer, setViewerTimer] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const meetId = localStorage.getItem("avathons") || getLocalStorage("avathondata")?._id;

  const endTime = getLocalStorage("roomData")?.endTime || getLocalStorage("meetdata")?.endTime;
  const [remaintime, setremaintimer] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [pollResults, setPollResults] = useState([])
  const[expid,setexpid] = useState(null);
  const[ispoll,setispoll] = useState(false);
  const[live,setviewlive] = useState(false);
  const queryParams = new URLSearchParams(location.search);
const userid = getLocalStorage("user")?._id;
let avathonid = localStorage.getItem("avathonid")
let avathondata = localStorage.getItem("avathondata");
  // Example: Get the value of a query parameter called 'id'
  const aid = queryParams.get('admin');

  const configuration = {
    iceServers: [
      {
        urls: ["stun:stun.l.google.com:19302"],
      },
        {
        urls: ["stun:13.201.146.161"]
      },
      {
         urls:"turn:13.201.146.161",
         username: "testuser",
        credential: "testpassword",
      },
    ],
  };

  const getalldata = async (meetId) => {
    try {
      let res = await useravathonApi(meetId);
      
    
      setduration(res.data.duration);
      setexpid(res.data._id);
      setdata(res.data.endEvent);
      settype(res.data);
      setTimezone(res.data.
        avtTimezone
        );
    } catch (err) {
      console.error("Failed to fetch meet data:", err);
    }
  };

  // UseEffect to call the getalldata function once the component mounts
  useEffect(() => {
    if (meetId) {
      getalldata(meetId); // Fetch data only if meetId is available
    }
  }, []); // Add meetId as a dependency to avoid calling the API unnecessarily

  useEffect(() => {
    socket.connect();

    // Fetch the available media devices
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setVideoDevices(videoInputDevices);

        // Set default camera to back camera if available
        const backCamera = videoInputDevices.find((device) =>
          device.label.toLowerCase().includes("back") ||
          device.label.toLowerCase().includes("rear") ||
          device.label.toLowerCase().includes("environment")
        );

        if (backCamera) {
          setSelectedCameraId(backCamera.deviceId);
        } else {
          setSelectedCameraId(videoInputDevices[0]?.deviceId || '');
        }
      })
      .catch((error) => {
        // Handle error accessing devices
      });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const sendReaction = (emoji) => {
    const user = getLocalStorage("user")?.userName;
    const roomId = params?.id;
    setSelectedEmoji(emoji);

    // Emit reaction to the socket server
    socket.emit('send-reaction', { emoji,roomId,user,viewerId:socket.id });

  
  };


  useEffect(() => {
    if (isBroadcaster) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev + 1;
if (meetdata && avtTimezone) {
      const currentTime = moment.tz(avtTimezone); // Current time in avatar's timezone

      // Remove 'Z' if present in meetdata to ensure it is treated as local time
      let meetTimeString = meetdata;

      if (meetTimeString.endsWith('Z')) {
        meetTimeString = meetTimeString.slice(0, -1); // Remove 'Z'
      }

      const meetTime = moment.tz(meetTimeString, avtTimezone); // Meeting time in avatar's timezone

      const timeLeft = Math.max(0, meetTime.diff(currentTime, 'seconds')); // Time left in seconds

      // Update remaining time state
      setremain(timeLeft);
    

      // Redirect when timeLeft hits 0
      if (timeLeft === 0) {
       
        navigate('/');
  
      }

      // Show Add More Time popup if the tour type is 'Private' and time left is less than or equal to 5 minutes

    }

    return newTime;
        });
           
       
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isBroadcaster, localStream, meetdata, popupDismissed]);

  const handleCloseModal = () => {
    setShowAddMoreTimeModal(false);
    setPopupDismissed(true); // Set flag to true when the popup is closed
  };

  // Function to format remaining time into HH:MM:SS
  const formatTime = (time) => {
    const hours = Math.floor(time / 3600); // Calculate hours
    const minutes = Math.floor((time % 3600) / 60); // Calculate remaining minutes
    const seconds = Math.floor(time % 60); // Calculate remaining seconds
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  useEffect(() => {
    // Handle socket events
    const handleConnectionError = (error) => {
      // Handle socket connection error
    };

    socket.on("connect", () => {
      // Handle successful connection
    });

    socket.on("disconnect", () => {
      // Handle disconnection
    });

    socket.on("connect_error", handleConnectionError);
    socket.on("connect_timeout", handleConnectionError);
    socket.on("pollResults", (data) => {
      setPollResults(data);
    });

    socket.on("createda", async (room) => {
      setIsBroadcaster(true);
      try {
        const stream = await getUserMedia();
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      //  addSystemMessage(" ");
      } catch (error) {
        // Error handled in getUserMedia
      }
    });

    socket.on("joineda", async (room) => {
      setIsBroadcaster(false);
      try {
        const stream = await getUserMedia(false);
        setLocalStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        addSystemMessage("Joined the room successfully");
      } catch (error) {
        // Error handled in getUserMedia
      }
    });

    socket.on("viewera", (viewerId) => handleViewerJoined(viewerId));
    socket.on("offera", (offer, broadcasterId) =>
      handleOffer(offer, broadcasterId)
    );
    socket.on("answera", (answer, viewerId) => handleAnswer(answer, viewerId));
    socket.on("ice-candidatea", (candidate, viewerId) =>
      handleICECandidate(candidate, viewerId)
    );
    socket.on("stopa", handleStop);
    socket.on("totala", (total) => {
      setViewers(total);
     
    });

    socket.on("broadcaster-lefta", handleBroadcasterLeft);
    socket.on("viewer-lefta", handleViewerLeft);
    socket.on("new-messagea", handleNewMessage);
    socket.on("recieve-reaction",handlereaction)
    socket.on("newpoll", handlePoll);


    return () => {
      // Cleanup socket events on unmount
      socket.off("createda");
      socket.off("joineda");
      socket.off("viewera");
      socket.off("offera");
      socket.off("answera");
      socket.off("ice-candidatea");
      socket.off("stopa");
      socket.off("broadcaster-lefta");
      socket.off("viewer-lefta");
      socket.off("connect_errora");
      socket.off("connect_timeouta");
      socket.off("new-messagea", handleNewMessage);
      socket.off("recieve-reaction", handlereaction);
      socket.off("pollResults");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [peerConnections, localStream]);

  const getUserMedia = async (audio = true) => {
    try {
      if (selectedCameraId) {
        return await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: { exact: selectedCameraId },
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: audio,
        });
      } else {
        return await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" }, // Prefer back camera
            width: { ideal: 1920 },
            height: { ideal: 1080 },
          },
          audio: audio,
        });
      }
    } catch (error) {
      handleMediaError(error);
      throw error; // Rethrow to prevent further execution
    }
  };

  const addSystemMessage = (message) => {
    setMessages((prevMessages) => [...prevMessages, { user: "System", message }]);
  };

  const handleNewMessage = (data) => {
    const { viewerId, message, user } = data;
    setMessages((prevMessages) => [...prevMessages, { user, message }]);
  };
  const handlereaction = (data) => {
    const { emoji, user } = data;
    setReaction((prev)=>{
      return [...prev,{user,emoji}]
    });
    setTimeout(() => {
      setReaction((prev) => prev.filter((reaction) => reaction.emoji !== emoji));
    }, 4000);
  };

  const handlePoll = (data)=>{
    const {question,options}  = data;
    
    setuserpoll({question,options})

  }
  

  const createRoom = () => {
    const generatedRoomId = params?.id;
    setRoomId(generatedRoomId);
    socket.emit("createa", generatedRoomId);
    socket.emit("detailss",avathonid);
  
  };

  const joinRoom = () => {
    const roomid = params?.id;
    setJoinId(roomid);
    if (roomid) {
      socket.emit("joina", roomid);
    }
  };

  const stopStream = () => {
    if (roomId) {
      socket.emit("stopa", roomId);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      addSystemMessage("Broadcaster has stopped the stream. Please wait, redirecting...");
      // Notify viewers and redirect after a delay
      // setTimeout(() => {
      //   window.location.href = "/"; // Redirect to main URL
      // }, 2000); // 5 minutes in milliseconds
    }
  };

  // const exitRoom = () => {
  //   if (roomId) {
  //     socket.emit("exita", roomId);
  //     if (localStream) {
  //       localStream.getTracks().forEach((track) => track.stop());
  //     }
  //     navigate('/user/dashboard');

  //     setTimeout(() => {
  //       window.location.href = "/user/dashboard"; // Redirect to dashboard
  //     }, 3000); // 3 seconds delay for user to read the message
  //   }
  // };

  const handleViewerJoined = (viewerId) => {
    const peerConnection = new RTCPeerConnection(configuration);
    setPeerConnections((prev) => ({ ...prev, [viewerId]: peerConnection }));

    localStream
      .getTracks()
      .forEach((track) => peerConnection.addTrack(track, localStream));

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", event.candidate, roomId, viewerId);
      }
    };

    peerConnection
      .createOffer()
      .then((offer) => peerConnection.setLocalDescription(offer))
      .then(() => {
        socket.emit("offera", peerConnection.localDescription, roomId, viewerId);
      })
      .catch((error) => {
        //addSystemMessage(" ");
      });
  };

  const handleOffer = async (offer, broadcasterId) => {
    const peerConnection = new RTCPeerConnection(configuration);
    setPeerConnections((prev) => ({
      ...prev,
      [broadcasterId]: peerConnection,
    }));

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidatea", event.candidate, roomId, broadcasterId);
      }
    };

    peerConnection.oniceconnectionstatechange = () => {
      if (peerConnection.iceConnectionState === "disconnected") {
        // Handle disconnection
      }
    };

    peerConnection.ontrack = (event) => {
      const remoteVideo = document.createElement("video");
      remoteVideo.srcObject = event.streams[0];
      remoteVideo.autoplay = true;
      remoteVideo.playsInline = true;
      remoteVideo.className = "videoStyle absolute top-0 left-0 w-screen h-svh z-[-2] object-cover bg-black";
      if (videosContainerRef.current) {
        videosContainerRef.current.appendChild(remoteVideo);
      }
    };

    try {
      await peerConnection.setRemoteDescription(offer);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      socket.emit("answera", answer, roomId, broadcasterId);
    } catch (error) {
      // Handle error
    }
  };

  const handleAnswer = (answer, viewerId) => {
    const peerConnection = peerConnections[viewerId];
    if (peerConnection) {
      peerConnection.setRemoteDescription(answer).catch(() => {
        // Handle error setting remote description
      });
    }
  };

  const handleICECandidate = (candidate, viewerId) => {
    const peerConnection = peerConnections[viewerId];
    if (peerConnection) {
      peerConnection
        .addIceCandidate(candidate)
        .catch(() => {
          // Handle error adding ICE candidate
        });
    }
  };

  const handleStop = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (videosContainerRef.current) {
      videosContainerRef.current.innerHTML = "";
    }
    // window.location.href = "/"; // Redirect to main URL
  };

  const handleBroadcasterLeft = () => {
    addSystemMessage("Broadcaster has left the room. Please wait, redirecting...");
    // setTimeout(() => {
    //   window.location.href = "/"; // Redirect to main URL
    // }, 3000); // 3 seconds delay for user to read the message
  };

  const handleViewerLeft = (viewerId) => {
    const peerConnection = peerConnections[viewerId];
    if (peerConnection) {
      peerConnection.close();
      setPeerConnections((prev) => {
        const { [viewerId]: removed, ...remaining } = prev;
        return remaining;
      });
      socket.emit("left",roomId);
      socket.on("total", (total) => {
      setViewers(total)

       
      });
  
      addSystemMessage("A viewer has left the room.");
    }
  };

  const handleMediaError = (error) => {
    // Handle media error
  };

  const handleCameraChange = async (event) => {
    const selectedDeviceId = event.target.value;
    setSelectedCameraId(selectedDeviceId);

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { exact: selectedDeviceId },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: true,
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      setLocalStream(stream);

      // Update the tracks in each peer connection
      Object.values(peerConnections).forEach((peerConnection) => {
        const videoSender = peerConnection
          .getSenders()
          .find((sender) => sender.track.kind === "video");
        if (videoSender) {
          videoSender.replaceTrack(stream.getVideoTracks()[0]);
        }
      });

      addSystemMessage("Camera switched successfully.");
    } catch (error) {
      handleMediaError(error);
    }
  };

  useEffect(() => {
    if (isBroadcaster && !localStream && selectedCameraId) {
      (async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              deviceId: { exact: selectedCameraId },
              width: { ideal: 1920 },
              height: { ideal: 1080 },
            },
            audio: true,
          });
          setLocalStream(stream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
         // addSystemMessage(" ");
        } catch (error) {
          // Handle error
        }
      })();
    }
  }, [isBroadcaster, localStream, selectedCameraId]);

  useEffect(() => {
    const currentPath = window.location.pathname;
    if (currentPath.includes("avathon_create")) {
      createRoom();
    } else if (currentPath.includes("avathon_join")) {
      joinRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddOption = () => {
    if (newOption.trim()) {
      setOptions([...options, newOption]);
      setNewOption("");
    }
  };

  const handleCreatePoll = () => {
    const roomId = params?.id;
    if (question.trim()) {
      // Emit the poll data with or without options
      socket.emit("createPoll", {
        question,
        options: options.length > 0 ? options : null, // Send options only if available
        roomId,
        viewerId: socket.id,
      });
  };
  setispoll(!ispoll);
}

  const handleSendMessage = (e) => {
    e.preventDefault();
    const user = getLocalStorage("user")?.userName;
    const roomId = params?.id;
    if (messageInput.trim()) {
      socket.emit("send-messagea", {
        roomId,
        viewerId: socket.id,
        message: messageInput,
        user,
      });
      setMessageInput("");
      setuserpoll(null);
    }
  };

  useEffect(() => {
    const scrollingMessages = document.querySelector("#scrolling-messages");
    if (scrollingMessages) {
      scrollingMessages.scrollTo(0, scrollingMessages.scrollHeight);
    }
  }, [messages]);

  // Format timer as HH:MM:SS
  const formatTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };
  function convertMilliseconds(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours} hour(s) and ${minutes % 60} minute(s)`;
    } else if (minutes > 0) {
        return `${minutes} minute(s) and ${seconds % 60} second(s)`;
    } else {
        return `${seconds} second(s)`;
    }
}

// Example usage
 // "45 second(s)"


  // Assuming duration is 40 minutes in seconds (2400 seconds)
  useEffect(() => {
    let count = 0; // Initialize count outside the interval

    if (!isBroadcaster) {
      const viewerTimerRef = setInterval(() => {
        setViewerTimer((prev) => {
          const newTime = prev + 1;

          if (meetdata && avtTimezone) {
            const currentTime = moment.tz(avtTimezone); // Current time in avatar's timezone

            // Remove 'Z' if present in meetdata to ensure it is treated as local time
            let meetTimeString = meetdata;

            if (meetTimeString.endsWith('Z')) {
              meetTimeString = meetTimeString.slice(0, -1); // Remove 'Z'
            }

            const meetTime = moment.tz(meetTimeString, avtTimezone); // Meeting time in avatar's timezone

            const timeLeft = Math.max(0, meetTime.diff(currentTime, 'seconds')); // Time left in seconds

            // Update remaining time state
            setremain(timeLeft);
          

            // Redirect when timeLeft hits 0
            if (timeLeft === 0) {
             
              navigate(`/user/rate-avathon/${expid}`,{ state: {res: type }});
        
            }

            // Show Add More Time popup if the tour type is 'Private' and time left is less than or equal to 5 minutes
      
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(viewerTimerRef);
    }
  }, [roomId, meetdata]);

  // Format the viewer's timer
  const formatViewerTimer = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const mins = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${hrs}:${mins}:${secs}`;
  };

const handleVote =(optionIndex)=>{
  
  const roomId = params?.id; // Ensure you pass the room ID or any unique identifier
  const viewerId = socket.id; // Get the current viewer's ID

  // Emit the vote to the server
  socket.emit("vote", { roomId, viewerId, optionIndex });

  setuserpoll(null);
}
  return (
    <>
      <div className="relative z-[1] before:block before:absolute before:-inset-0 before:bg-black/10 before:z-[-1] overflow-hidden">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex flex-col items-center space-y-1 absolute top-[20px] sm:top-[10px] left-auto right-[20px] sm:left-[10px] sm:right-[10px] mt-[40px]">
          {isBroadcaster && (
            <>
              
               
              {/* You can add broadcaster-specific controls here */}
            </>
          )}
          {!isBroadcaster && aid!=1&&(
            <>
              <div className="flex gap-x-5">
                <div className=" text-white">
                  <span>Streaming Time: {formatViewerTimer(viewerTimer)}</span>
                
                </div>
                <div className=" text-white">
                  <span>Remaining Time: {formatViewerTimer(remain)}</span>
                </div> 
               
              </div>

            </>
          )}
          {isBroadcaster && (
            <>               {ispoll && (  <button
              onClick={handleCreatePoll}
              className="w-[20%] absolute right-0  bg-white   text-black py-2 rounded-lg font-medium"
            >
              Done
            </button>)}
            <div className="flex  items-center space-x-2 text-white w-full">
            
              <span className="text-white rounded-md bg-[#fff]/[.2] px-[6px] py-[4px] text-sm">Streaming Time: {formatTimer(timer)}</span>
              <span className="text-white rounded-md bg-[#fff]/[.2] px-[6px] py-[4px] text-sm">Remaining Time: {formatViewerTimer(remain)}</span>
        
            </div>
            </>

          )}
        </div>

        <div id="error-message" style={{ display: "none" }}>
          {/* Error messages are handled via system messages */}
        </div>

        <div
          id="videos"
          className="has-video flex flex-wrap flex-col justify-between h-svh px-[20px] pt-[20px] sm:px-[10px] sm:pt-[10px]"
        >
          {isBroadcaster ? (
            <>


              <video
                className="videoStyle absolute top-0 left-0 w-screen h-svh z-[-2] object-cover has-video"
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
              ></video>
             {pollResults?.length>0 &&(
              <div className=" cursor-pointer lg:w-[20%] sm:w-[40%] right-0 bg-white text-black px-3 py-1 rounded-sm sm:absolute sm:top-[46px] sm:right-[10px]  ">
                 <div onClick={()=>setviewlive(!live)}>View poll Result</div>
              </div>
             )}
              
            
              <div className="watching-live-count text-white inline-flex items-center gap-[5px] text-lg sm:text-base absolute top-auto left-auto bottom-[80px] right-[20px] leading-none">
                <img src={Images.iconEyeLight} alt="Viewers" />
                {viewers}
             <div onClick={()=>setispoll(!ispoll)} className=" cursor-pointer absolute bottom-14 right-0 bg-white text-black px-3 py-2 rounded-sm ">
             
              <p className="text-[28px]">+</p>
             </div>
              </div>
              {live && (
  <div className="mt-4 bg-gray-50 p-4 border border-gray-200 rounded sm:absolute w-[94%] sm:top-[80px]">
    <h4 className="text-sm font-semibold mb-3">Live Results:</h4>
    {pollResults?.map((result, index) => (
      <div key={index} className="flex items-center justify-between mb-2">
        <span className="text-sm">
          {viewpoll?.options?.[index] || "Option"}
        </span>
        <span className="text-sm font-medium">{result} votes</span>
      </div>
    ))}
  </div>
)}

   
    {ispoll && (
                <div className=" bg-white  rounded-md w-80 mx-auto  shadow-lg sm:absolute sm:w-[95%] sm:top-[120px]">
               <input
        type="text"
        placeholder="Enter your Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="w-full bg-black text-white py-2 px-4  text-center text-lg font-semibold placeholder-white focus:outline-none  mb-4"
      />
                <div className="space-y-3 px-3 ">
                  {options.map((option, index) => (
                    <div
                      key={index}
                      className="bg-[#F4F4F4] py-2 px-4 rounded-lg text-sm font-medium"
                    >
                      {option}
                    </div>
                  ))}
                  <input
                    type="text"
                    placeholder="Add another option..."
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    className="w-full bg-[#F4F4F4] text-black py-2 px-4 rounded-lg placeholder-gray-500 focus:outline-none"
                  />
                </div>
               <div>
               <button
                  onClick={handleAddOption}
                  className="w-full mt-4 bg-[#000000]  text-white py-2   font-medium"
                >
                  Add Option
                </button>
               </div>
             
              </div>
    )}

            </>
          ) : (
            <div
              className="videoStyle absolute top-0 left-0 w-screen h-svh z-[-2] object-cover bg-black"
              ref={videosContainerRef}
            ></div>
          )}

          <div className="mt-auto">
                
        {selectedEmoji && (
          <div className="mt-4 text-green-500 text-sm">
          
          </div>
        )}
    
            <div
              id="scrolling-messages"
              className="scrollbar-hidden h-48 overflow-y-auto mb-[20px] pr-[40%] md:pr-[20%] sm:pr-[100px] text-white"
            >
              {messages.map((msg, index) => (
                <div key={index} className="mb-[20px]">
                  <strong className="font-semibold text-lg sm:text-base line-clamp-1 drop-shadow-md leading-none mb-[6px] sm:mb-[4px] capitalize">
                    {msg.user}:
                  </strong>{" "}
                  <p className="text-sm sm:text-xs line-clamp-3 drop-shadow-md">
                    {msg.message}
                  </p>
                </div>
              ))}
              
             {reactions.map((ite)=>{
              return(
                <>
                 <p>{ite.user} send a reaction : <span>{ite.emoji}</span></p>
                
                </>
              )
             })}
           
            </div>
            {!isBroadcaster && aid != 1 && (
             <>       
  {viewpoll && (
  <div className="w-full max-w-md mx-auto mt-6 mb-5">
    <div className="bg-white shadow-lg border border-gray-200">
      <div className="text-white text-sm font-semibold mb-2 text-md text-center bg-black py-3">
        <h3>Response to question</h3>
      </div>
      <div className="text-gray-900 text-lg font-medium text-center py-3">
        <p>{viewpoll?.question}</p>
        {viewpoll?.options && viewpoll.options.length > 0 && (
          <div className="mt-3">
            {viewpoll.options.map((item, index) => (
              <button
              key={index}
              onClick={() => handleVote(index)} // Call the vote handler
              className="w-full text-left bg-gray-100 hover:bg-blue-100 py-2 px-4 mb-2 rounded border border-gray-300 text-sm"
            >
              {item}
            </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </div>
)}        <div className="flex items-center justify-between space-x-4 mb-4">
{emojis.map((emoji, index) => (
  <button
    key={index}
    className="text-2xl hover:scale-110 transform transition duration-200"
    onClick={() => sendReaction(emoji)}
    aria-label={`Send ${emoji}`}
  >
    {emoji}
  </button>
))}
</div>
              <form
                className="flex flex-wrap justify-between pb-[20px] sm:pb-[10px]"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-[#E5E5E5]/30 border-2 px-4 placeholder-white font-medium border-white rounded-full text-base sm:text-sm text-white w-[calc(100%-100px)] h-[46px]"
                />
                <div class="flex items-center justify-between space-x-4">
   
    
    </div>
                <button
                  type="submit"
                  className="bg-[#2d2d2d] hover:bg-[#1f1f1f] text-white font-bold h-[46px] px-4 rounded-full"
                >
                  Send
                </button>
        
              </form>
       
              
              
              
              </>

            )}
          </div>
        </div>
      </div>
      
    </>
  );
 
};

export default Avathons;
