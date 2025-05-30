import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import Images from "@/constant/Images";
import { Toaster, toast } from "react-hot-toast";
import { setRoomData } from "@/store/slice/videoSlice";
import { useDispatch } from "react-redux";
import AddMoreTime from "@/components/Modal/AddMoreTimeModal";
import { getmeetdata } from "@/utills/service/userSideService/userService/UserHomeService";
import { useNavigate } from "react-router-dom";
import { getAvailableApi } from "@/utills/service/avtarService/AddExperienceService";
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
const Room = () => {
  const location = useLocation();
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
  const [messageInput, setMessageInput] = useState("");
  const [showAddMoreTimeModal, setShowAddMoreTimeModal] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
  const [meetdata, setdata] = useState(null);
  const [type, settype] = useState(null);
  const params = useParams();
 
  const navigate = useNavigate();
  const [viewerTimer, setViewerTimer] = useState(0);
  const[offerTimer, setofferTimer] = useState(0);
  const [timer, setTimer] = useState(0);
  const timerRef = useRef(null);
  const meetId = localStorage.getItem("meet") || getLocalStorage("meetdata")?._id;
  const endTime = getLocalStorage("roomData")?.endTime || getLocalStorage("meetdata")?.endTime;
  const [remaintime, setremaintimer] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const[expid,setexpid] = useState(null);
  const queryParams = new URLSearchParams(location.search);

let offerdata  = JSON.parse(localStorage.getItem('orderdata'));
let offerendtime = offerdata?.endTime;
let avatarTimezone = localStorage.getItem('avatarTime');



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
      let res = await getmeetdata(meetId);
    
      setduration(res.data.duration);
      setexpid(res.data.ExpId);
      setdata(res.data.endTime);
      settype(res.data);
      setTimezone(res.timeZone);
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

  useEffect(() => {
    if (isBroadcaster && localStream) {
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);

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
          setRemainingTime(timeLeft);

          // Optional: Log or take any action when the time is up
          if (timeLeft === 0) {
            console.log("Meeting time is up!");
            // You can add any logic here when the time reaches zero
             if (timeLeft === 0) {
              navigate("/avatar/experience?tab=completed");
            
            }

          }
        }
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isBroadcaster, localStream, meetdata, popupDismissed]);

  useEffect(() => {
    const viewerTimerRef = setInterval(() => {
      setofferTimer((prev) => {
        const newTime = prev + 1;
  
        if (offerdata && avatarTimezone) {
  
          const currentTime = moment.tz(avatarTimezone); // Current time in avatar's timezone
  
          // Remove 'Z' if present in meetdata to ensure it is treated as local time
          let meetTimeString = offerdata?.endTime;
  
          if (meetTimeString.endsWith('Z')) {
            meetTimeString = meetTimeString.slice(0, -1); // Remove 'Z'
          }
  
          const meetTime = moment.tz(meetTimeString, avatarTimezone); // Meeting time in avatar's timezone
  
          const timeLeft = Math.max(0, meetTime.diff(currentTime, 'seconds')); // Time left in seconds
 
          // Update remaining time state
          setremain(timeLeft);
  
          // Redirect when timeLeft hits 0
          if (timeLeft === 0) {
            navigate(`/`);
          }
        }
  
        return newTime;
      });
    }, 100);
  
    return () => clearInterval(viewerTimerRef);
  
  }, [offerdata, avatarTimezone]);



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

    socket.on("created", async (room) => {
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

    socket.on("joined", async (room) => {
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

    socket.on("viewer", (viewerId) => handleViewerJoined(viewerId));
    socket.on("offer", (offer, broadcasterId) =>
      handleOffer(offer, broadcasterId)
    );
    socket.on("answer", (answer, viewerId) => handleAnswer(answer, viewerId));
    socket.on("ice-candidate", (candidate, viewerId) =>
      handleICECandidate(candidate, viewerId)
    );
    socket.on("stop", handleStop);
    socket.on("total", (total) => {
      setViewers(total);
     
    });

    socket.on("broadcaster-left", handleBroadcasterLeft);
    socket.on("viewer-left", handleViewerLeft);
    socket.on("new-message", handleNewMessage);

    return () => {
      // Cleanup socket events on unmount
      socket.off("created");
      socket.off("joined");
      socket.off("viewer");
      socket.off("offer");
      socket.off("answer");
      socket.off("ice-candidate");
      socket.off("stop");
      socket.off("broadcaster-left");
      socket.off("viewer-left");
      socket.off("connect_error");
      socket.off("connect_timeout");
      socket.off("new-message", handleNewMessage);
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

  const createRoom = () => {
    const generatedRoomId = params?.id;
    setRoomId(generatedRoomId);
    socket.emit("create", generatedRoomId);
  };

  const joinRoom = () => {
    const roomid = params?.id;
    setJoinId(roomid);
    if (roomid) {
      socket.emit("join", roomid);
    }
  };

  const stopStream = () => {
    if (roomId) {
      socket.emit("stop", roomId);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
      addSystemMessage("Broadcaster has stopped the stream. Please wait, redirecting...");
      // Notify viewers and redirect after a delay
      setTimeout(() => {
        window.location.href = "/"; // Redirect to main URL
      }, 2000); // 5 minutes in milliseconds
    }
  };

  const exitRoom = () => {
    if (roomId) {
      socket.emit("exit", roomId);
      if (localStream) {
        localStream.getTracks().forEach((track) => track.stop());
      }
      navigate('/user/dashboard');

      setTimeout(() => {
        window.location.href = "/user/dashboard"; // Redirect to dashboard
      }, 3000); // 3 seconds delay for user to read the message
    }
  };

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
        socket.emit("offer", peerConnection.localDescription, roomId, viewerId);
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
        socket.emit("ice-candidate", event.candidate, roomId, broadcasterId);
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
      socket.emit("answer", answer, roomId, broadcasterId);
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
    window.location.href = "/"; // Redirect to main URL
  };

  const handleBroadcasterLeft = () => {
    addSystemMessage("Broadcaster has left the room. Please wait, redirecting...");
    setTimeout(() => {
      window.location.href = "/"; // Redirect to main URL
    }, 3000); // 3 seconds delay for user to read the message
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
    if (currentPath.includes("room_create")) {
      createRoom();
    } else if (currentPath.includes("room_join")) {
      joinRoom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSendMessage = (e) => {
    e.preventDefault();
    const user = getLocalStorage("user")?.userName;
    const roomId = params?.id;
    if (messageInput.trim()) {
      socket.emit("send-message", {
        roomId,
        viewerId: socket.id,
        message: messageInput,
        user,
      });
      setMessageInput("");
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
             
              navigate(`/user/rate-tour/${expid}`,{ state: {res: type }});
        
            }

            // Show Add More Time popup if the tour type is 'Private' and time left is less than or equal to 5 minutes
            if (type.tourtype === "Private") {
              if (timeLeft <= 300 && timeLeft > 0 && count <= 1) {
                setShowAddMoreTimeModal(true);
                count++;
              }
            } else {}
          }

          return newTime;
        });
      }, 1000);

      return () => clearInterval(viewerTimerRef);
    }
  }, [roomId, meetdata]);







  
  // Log the remaining time whenever it changes
 



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

  return (
    <>
      <div className="relative z-[1] before:block before:absolute before:-inset-0 before:bg-black/10 before:z-[-1] overflow-hidden">
        <Toaster position="top-right" reverseOrder={false} />

        <div className="flex flex-col items-center space-y-1 absolute top-[20px] sm:top-[10px] left-auto right-[20px] sm:left-[10px] sm:right-[10px] mt-[40px]">
          {isBroadcaster && (
            <>
          
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
            <div className="flex items-center space-x-2 text-white w-full">
              <span className="text-white rounded-md bg-[#fff]/[.2] px-[6px] py-[4px] text-sm">Streaming Time: {formatTimer(timer)}</span>
             {offerdata? <span className="text-white rounded-md bg-[#fff]/[.2] px-[6px] py-[4px] text-sm">
                Remaining Time: {formatTime(remain)}
              </span>: <span className="text-white rounded-md bg-[#fff]/[.2] px-[6px] py-[4px] text-sm">
                Remaining Time: {formatTime(remainingTime)}
              </span>}
            </div>
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
              <div className="watching-live-count text-white inline-flex items-center gap-[5px] text-lg sm:text-base absolute top-auto left-auto bottom-[80px] right-[20px] leading-none">
                <img src={Images.iconEyeLight} alt="Viewers" />
                {viewers}
              </div>
            </>
          ) : (
            <div
              className="videoStyle absolute top-0 left-0 w-screen h-svh z-[-2] object-cover bg-black"
              ref={videosContainerRef}
            ></div>
          )}

          <div className="mt-auto">
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
            </div>
            {!isBroadcaster && aid != 1 && (
              <form
                className="flex flex-wrap justify-between pb-[20px] sm:pb-[10px]"
                onSubmit={handleSendMessage}
              >
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  className="bg-[#E5E5E5]/30 border-2 px-4 placeholder-white font-medium border-white rounded-full text-base sm:text-sm text-white w-[calc(100%-80px)] h-[46px]"
                />
                <button
                  type="submit"
                  className="bg-[#2d2d2d] hover:bg-[#1f1f1f] text-white font-bold h-[46px] px-4 rounded-full"
                >
                  Send
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <AddMoreTime
        meetId={meetId}
        show={showAddMoreTimeModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default Room;
