import Images from "@/constant/Images";

import moment from  "moment-timezone"; // Import moment-timezone
import {
  formatDate,
  formatTime,
  formatTimestamp,
  getDateTimeForTimezone,
} from "@/constant/date-time-format/DateTimeFormat";
import { createmeeting } from "@/utills/service/avtarService/AddExperienceService";
import socket from "@/utills/socket/Socket";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import { getAvailableApi } from "@/utills/service/avtarService/AddExperienceService";
import { deleteAvathonsApi, getAvathonsApi } from "@/utills/service/avtarService/CreateAvathonsService";
import Loader from "@/components/Loader";
import toast from "react-hot-toast";


const AvathonCard = ({ item, role,experienceStatus,setExperienceStatus }) => {

      let navigate = useNavigate();
      const [loader, setLoader] = useState(false);
      const[visible,setvisible]  =useState(false);
      
const handleEditAvathons = (item) => {
        navigate("/avatar/edit-avathons/" + item?._id, { state: item });
      };

     const handleDeleteAvathons = async () => { 
        if (item) {
          setLoader(true);
          try {
            const response = await deleteAvathonsApi(item?._id);
            if (response?.isSuccess) {
            
              toast.success("Avathons success deleted");
              setExperienceStatus(experienceStatus?.data?.filter((item)=>{
                return item._id !== item._id
              }))
       
            }
          } catch (error) {
            console.log(error);
          } finally {
            setLoader(false);
          }
        }
      };
 const [countdown, setCountdown] = useState("");
 const timezones = Intl.DateTimeFormat().resolvedOptions().timeZone;

 const timezone = item?.availability?.timezone || timezones; // Get the timezone for the avatar
 const mytime = item?.avathonTime; // This is the avathon start time
 
 const getRemainingTime = () => {
   const exacttime = getDateTimeForTimezone(timezone); // Get the current time for the avatar's timezone
 
   // Parse both times using moment
   const avathonMoment = moment.tz(mytime, timezone); // Convert avathontime to a moment object in the same timezone
   const exactMoment = moment.tz(exacttime, timezone); // Convert exacttime to a moment object in the specified timezone
 
   // Calculate the difference
   let timeDifference = avathonMoment.diff(exactMoment); // The difference in milliseconds
 
   if (timeDifference < 0) {
    setvisible(true);
     return "Start Event";
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
 const createroom = (item)=>{
  const generatedRoomId =  Math.random().toString(36).substr(2, 2);
  setLocalStorage("avId", generatedRoomId);
  navigate(`/avatar/avathon_create/${generatedRoomId}`);
  localStorage.setItem("avathonid",item?._id);
 }
  return (
    <div className="p-4 sm:p-0 sm:mt-2">
      <div className="BoxShadowLessRounded  sm:pb-2">
        <div className="flex p-4 flex-wrap sm:p-2">
          <div className="w-[30%] relative">
            <video
              src={item?.avathonsThumbnail || Images.cardImageRounded}
              alt="cardImageRounded"
              className="w-full object-cover h-full rounded-lg aspect-square"
            />
            {role === "avatar" && (
              <div className="absolute bottom-2 right-1 px-2 rounded-full font-bold bg-white text-sm">
                ${item?.totalPrice.toFixed(2)}
              </div>
            )}
          </div>
          <div className="w-[70%] pl-3">
      <div className="flex items-center justify-between">
      <h2 className="text-lg font-bold sm:text-sm leading-5 line-clamp-2">
              {item?.avathonTitle}
            </h2>
         <div onClick={() => handleEditAvathons(item)} className="bg-white p-2 rounded-md  sm:p-1 cursor-pointer inline-block">
                   <img src={Images.edit} alt="edit" className="w-6 h-6 sm:w-4 sm:h-4" />
                 </div>
      </div>
            <div className="flex justify-between items-center gap-2 py-1 sm:py-[2px] text-xs">
              <div className="icon">
                <img src={Images.location} alt="location" className="w-3 h-3" />
              </div>
              <div className="flex-1">
                {item?.City && item?.City + ","} {item?.Country}
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
              <div className="flex-1">{formatDate(item?.avathonDate)}</div>
            </div>
            <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs">
              <div className="icon">
                <img src={Images.clock} alt="clock" className="w-3 h-3" />
              </div>
              <div className="flex-1">
                {formatTime(item?.avathonTime)}
              </div>
            </div>
          </div>
          <div className="w-full  text-center mt-3">
          <div className="bg-gray-800 w-[100%]  text-white font-medium px-4 py-2 rounded hover:bg-gray-700" >
    <button disabled={!visible}  onClick={()=>createroom(item)}>

    {countdown}

    </button>
  </div>
          </div>
          <div className="flex w-full gap-3 mt-3">
 
          <button
  className={`flex-1 font-medium px-4 py-2 rounded ${
    item?.avathonsStatus === "Accepted"
      ? "bg-green-100 text-green-600"
      : item?.avathonsStatus === "In Review"
      ? "bg-yellow-100 text-yellow-600"
      : item?.avathonsStatus === "Rejected"
      ? "bg-red-100 text-red-600"
      : "bg-gray-100 text-gray-600"
  }`}
>
  {item?.avathonsStatus}
</button>



  <button className="bg-gray-800 flex-1 text-white font-medium px-4 py-2 rounded hover:bg-gray-700" onClick={handleDeleteAvathons}>
    Delete
  </button>
</div>


        </div>
      
      </div>
    </div>
  );
};

export default AvathonCard;
