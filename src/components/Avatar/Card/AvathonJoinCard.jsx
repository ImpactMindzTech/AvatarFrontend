import Images from "@/constant/Images";
import IconText from "../Heading/IconText";
import { Link, useNavigate } from "react-router-dom";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import socket from "@/utills/socket/Socket";
import Loader from "@/components/Loader";
import { useEffect, useState } from "react";
import moment from "moment-timezone";
import {
  calculateRemainingTime,
  convertTo12HourFormats,
  formatDate,
  formatTime,
  getDateTimeForTimezone,
} from "@/constant/date-time-format/DateTimeFormat";
import { completeoffer } from "@/utills/service/userSideService/userService/UserHomeService";

export default function AvathonJoinCard({ state, item }) {


  const[buttonActive,setButtonActive] = useState(false);
  const [remainingTime, setRemainingTime] = useState(null);
  const [isCountdownOver, setIsCountdownOver] = useState(false);
  const [loader, setLoader] = useState(false);
  const [, forceUpdate] = useState(0);
  const navigate = useNavigate();
  const[visible,setvisible]  =useState(false);

  

  const handlejoin = () => {
    socket.connect();
    localStorage.setItem("avathons",item?.avathonId?._id)
      window.location.href = `/user/avathon_join/${item?.avathonId?.roomId}`;
  };

  const handlecomplete = async (item) => {
    const id = item?._id;
    setLoader(true); // Show the loader

    try {
      let response = await completeoffer(id);

      // After the action is completed, navigate to the offers tab
      navigate("/user/experience?tab=offers");

      setLoader(false); // Hide the loader
      forceUpdate((n) => n + 1); // Force a re-render if necessary
    } catch (err) {
      console.log(err);
      setLoader(false); // Hide the loader in case of an error
    }
  };

  useEffect(() => {
    socket.connect();
    socket.on("roomIdss", (data) => {
      localStorage.setItem("jid", data.roomId);
      setid(data.roomId);
      setButtonActive(true); // Button becomes active after the room ID is received
    });
  }, []);

  useEffect(() => {
    socket.connect();
    socket.emit("userOnline", item?.userId);
  }, []);


 const [countdown, setCountdown] = useState("");
 const timezone = item?.availability?.timeZone; // Get the timezone for the avatar
 const mytime = item?.avathonId?.avathonTime; // This is the avathon start time
 
 const getExactTimeForTimezone = (timezone) => {
  const date = new Date();
  return date.toLocaleString('en-US', { timeZone: timezone });
};

 const getRemainingTime = () => {
   const exacttime = getExactTimeForTimezone(timezone); // Get the current time for the avatar's timezone
 
   // Parse both times using moment
   const avathonMoment = moment.tz(mytime, timezone); // Convert avathontime to a moment object in the same timezone
   const exactMoment = moment.tz(exacttime, timezone); // Convert exacttime to a moment object in the specified timezone
 
   // Calculate the difference
   let timeDifference = avathonMoment.diff(exactMoment); // The difference in milliseconds
 
   if (timeDifference < 0) {
     return "Event started";
   }
 
   // Convert the difference to hours, minutes, and seconds
   const duration = moment.duration(timeDifference);
   const hours = Math.floor(duration.asHours());
   const minutes = duration.minutes();
   const seconds = duration.seconds();
 
   // Format the result as a string, e.g., "hh:mm:ss"
   const formattedDifference = `${hours}hrs : ${minutes}min : ${seconds}sec`;
   return formattedDifference;
 };
 
 useEffect(() => {
   const interval = setInterval(() => {
     const newCountdown = getRemainingTime();
     setCountdown(newCountdown);
 
     // Stop the countdown if the event has started
     if (newCountdown === "Event started") {
       setvisible(true);
       clearInterval(interval);
     }
   }, 1000);
 
   // Clean up the interval when the component unmounts
   return () => clearInterval(interval);
 }, [mytime, timezone]);
 

  return (
    <>
      {loader && <Loader />}
       <div className="p-4 sm:p-0 sm:mt-2">
            <div className="BoxShadowLessRounded  sm:pb-2">
              <div className="flex p-4 flex-wrap sm:p-2">
                <div className="w-[30%] relative">
                 {item?.avathonId?.avathonsThumbnail==" "? <img className="w-[100%] aspect-[1.4] object-cover rounded-2xl" src={item?.avathonId?.avathonsImage[0]}></img>:<video
                    src={item?.avathonId?.avathonsThumbnail || Images.cardImageRounded}
                    alt="cardImageRounded"
                    className="w-full object-cover h-full rounded-lg aspect-square"
                  />
               } 
                 
                 


           
                </div>
                <div className="w-[70%] pl-3">
            <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold sm:text-sm leading-5 line-clamp-2">
                    {item?.avathonId?.avathonTitle}
                  </h2>
            
            </div>
                  <div className="flex justify-between items-center gap-2 py-1 sm:py-[2px] text-xs">
                    <div className="icon">
                      <img src={Images.location} alt="location" className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      {item?.avathonId?.City && item?.avathonId?.City + ","} {item?.avathonId?.Country}
                    </div>
                  </div>
      
                 
                  <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs">
                    <div className="icon">
                      <img
                        src={Images.calendarIcon}
                        alt="calendarIcon"
                        className="w-3 h-3"
                      />
                    </div>
                    <div className="flex-1">{formatDate(item?.avathonId?.avathonDate)}</div>
                  </div>
                  <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs">
                    <div className="icon">
                      <img src={Images.clock} alt="clock" className="w-3 h-3" />
                    </div>
                    <div className="flex-1">
                      {formatTime(item?.avathonId?.avathonTime)}
                    </div>
                  </div>
                </div>
                <div className="flex w-full gap-3 mt-3 bg-backgroundFill-900 items-center justify-center">
  <div>
  <img src={Images.timer} alt="" />
  </div>
  <div
    className=" font-medium px-4 py-2 rounded text-white text-center"
  >
    {countdown}
  </div>
</div>

           {item?.avathonId?.roomId && (     <div className="flex w-full gap-3 mt-3 bg-backgroundFill-900 items-center justify-center">
       
       <button  onClick={() => handlejoin()}
className="flex-1 font-medium px-4 py-2 rounded text-white" 
>
join
</button>




</div>)}
      
      
              </div>
            
            </div>
          </div>
    </>
  );
}
