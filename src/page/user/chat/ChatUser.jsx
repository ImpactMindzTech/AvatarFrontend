import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import { formatTime } from "@/constant/date-time-format/DateTimeFormat";
import Images from "@/constant/Images";
import {
  ChatMessageGetByConversationIdApi,
  sendMessageApi,
} from "@/utills/service/userSideService/ChatService";
import socket from "@/utills/socket/Socket";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useParams } from "react-router-dom";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const ChatUser = () => {
  const [loader, setLoader] = useState(false);
  const params = useParams();
  const location = useLocation();
  const [name, setName] = useState(location?.state?.item);
  const [inputMessage, setInputMessage] = useState("");
  const [user, setUser] = useState(
    () => JSON.parse(localStorage.getItem("user")) || {}
  );
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState("");
  const simpleBarRef = useRef();
  const containRef = useRef();

  useEffect(() => {
    socket.connect();
    if (socket) {
      socket.emit("addUser", user?._id);

      const handleIncomingMessage = (data) => {
        // // if (data.receiverId === user?._id) {
        // //   toast(`New message from ${data.user.fullname}: ${data.message}`, {
        // //     duration: 6000,
        // //   });
        // }
        setMessages((prevMessages) => [
          ...prevMessages,
          { user: data.user, message: data.message, time: data.time },
        ]);
      };

      socket.on("getMessage", handleIncomingMessage);

      return () => {
        socket.off("getMessage", handleIncomingMessage);
      };
    }
  }, [socket, user?._id]);

  const sendMessage = useCallback(async () => {
    if (!inputMessage.trim()) return;
    const localTime = new Date();
    const currentTimeUTC = localTime.toISOString();
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    socket.emit("sendMessage", {
      conversationId: selectedConversationId || "new",
      senderId: user?._id || "",
      message: inputMessage,
      receiverId: params?.id,
      time: currentTimeUTC,
      timezone: userTimeZone,
    });

    const body = {
      conversationId: selectedConversationId || "new",
      senderId: user?._id,
      message: inputMessage,
      receiverId: params?.id,
      time: currentTimeUTC,
      timezone: userTimeZone,
    };

    setInputMessage("");

    try {
      const response = await sendMessageApi(body);
      if (response?.message === "message sent successfully") {
        console.log("Message sent successfully");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [inputMessage, socket, selectedConversationId, user?._id, params?.id]);

  const fetchMessages = useCallback(async () => {
    const conversationId = selectedConversationId || "new";
    const body = {
      senderId: user?._id,
      receiverId: params?.id,
    };

    try {
      setLoader(true);
      const response = await ChatMessageGetByConversationIdApi(
        conversationId,
        body.senderId,
        body.receiverId
      );
      if (response?.isSuccess) {
   
        setMessages(response.messages || []);
        setSelectedConversationId(response?.conversationId || "");
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoader(false);
    }
  }, [user?._id, params?.id, selectedConversationId]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  useEffect(() => {
    if (simpleBarRef.current) {
      const scrollElement = simpleBarRef.current.getScrollElement();
      scrollElement.scrollTop = scrollElement.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    setMessages([]);
  }, [params?.id]);

  return (
    <>
      {loader && <Loader />}
      <div className="container chat-user">
        <HeaderBack link="/avatar/chat" text={name?.name || "Chat"} />
        <div className="m-auto h-[80vh] sm:h-[82vh] relative px-[10px]">
          <SimpleBar ref={simpleBarRef} className="h-[70vh] sm:h-[72vh]">
            <div ref={containRef} className="w-full py-2 flex flex-col">
              <div className="child h-full">
                <div className="rounded-lg bg-boxFill-900 text-grey-800 flex justify-center p-2 sm:px-10 w-[15%] m-auto sm:text-xs sm:py-[6px]">
                  Today
                </div>
              </div>

              {messages.map(({ message, user: { id } = {}, time }, index) => {
                const isCurrentUser = id === user?._id;
                return (
                  <div
                    key={index}
                    className={`pt-[8px] ${
                      isCurrentUser ? "text-right" : "text-left"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] w-auto inline-block p-2 sm:text-xs ${
                        isCurrentUser
                          ? "bg-[#2d2d2d] text-white rounded-bl-lg rounded-t-lg ml-auto"
                          : "bg-secondary rounded-t-lg rounded-br-lg"
                      }`}
                    >
                      {typeof message?.message === "string"
                        ? message.message
                        : ""}
                      {typeof message === "string" ? message : ""}
                    </div>
                    <p className="text-grey-800 mt-1 text-xs">
                      {time
                        ? formatTime(new Date(time))
                        : formatTime(new Date())}
                    </p>
                  </div>
                );
              })}
            </div>
          </SimpleBar>

          <div className="absolute bottom-0 left-0 w-full h-20 gap-2 flex justify-between items-center">
            <div className="relative flex-1">
              <input
                type="text"
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Send message..."
                className="p-3 px-5 w-full bg-boxFill-900 rounded-md outline-none"
              />
            </div>

            <div
              onClick={sendMessage}
              className="bg-[#2d2d2d] rounded-md cursor-pointer p-3 sm:w-[15%] w-[8%] flex justify-center items-center"
            >
              <img src={Images.sendIcon} alt="send icon" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatUser;
