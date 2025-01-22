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
import { notifi } from "@/utills/service/userSideService/userService/UserHomeService";


const AvathonCard = ({ item, role,experienceStatus,setExperienceStatus,getRequests }) => {
  const videourl = localStorage.getItem('video');
  const imgUrl = localStorage.getItem('img');
  const[videosrc,setvideosrc] = useState(videourl || item?.avathonsThumbnail);
  const[imgsrc,setimgsrc] = useState(imgUrl);
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
  try {
    if (!mytime || !timezone) {
      console.error('Missing required inputs: `mytime` or `timezone`.');
      return 'Invalid Input';
    }

    // Ensure `mytime` is in ISO 8601 format and calculate times in the avatar's timezone
    const avathonMoment = moment.tz(mytime, "YYYY-MM-DDTHH:mm:ss", timezone);
    const exactMoment = moment.tz(moment(), timezone); // Current time in the specified timezone

    // Validate the moment objects
    if (!avathonMoment.isValid() || !exactMoment.isValid()) {
      console.error('Invalid date format. Ensure `mytime` is a valid ISO 8601 string.');
      return 'Invalid Date';
    }

    // Calculate the difference in milliseconds
    const timeDifference = avathonMoment.diff(exactMoment);

    // Handle specific status cases
    if (item?.avathonsStatus === 'Accepted') {
      setvisible(true);
      if (timeDifference <= 0) {
       
        return 'Start Event';
      }
    }
  
    if(timeDifference<0){
      setvisible(false);
      return item.avathonsStatus;
    }

    // Convert the time difference to hours, minutes, and seconds
    const duration = moment.duration(timeDifference);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();

    // Format the countdown as "HH : MM : SS"
    const formattedDifference = `${hours.toString().padStart(2, "0")}h : ${minutes.toString().padStart(2, "0")}m : ${seconds.toString().padStart(2, "0")}s`;
    return formattedDifference;
  } catch (error) {
    console.error('Error in getRemainingTime:', error);
    return 'Error calculating time';
  }
};

 
useEffect(() => {
  const interval = setInterval(() => {
    const newCountdown = getRemainingTime();
    setCountdown(newCountdown);

    // Stop the countdown if the event has started
    if (newCountdown === "Event started") {
      clearInterval(interval);
    }
  }, 1000);

  // Cleanup the interval on unmount
  return () => clearInterval(interval);

}, [mytime, timezone]);  // Dependencies

 const createroom = async(item)=>{


  
  const generatedRoomId =  Math.random().toString(36).substr(2, 2);
  setLocalStorage("avId", generatedRoomId);
  navigate(`/avatar/avathon_create/${generatedRoomId}`);
  localStorage.setItem("avathonid",item?._id);
  localStorage.setItem("avathondata",JSON.stringify(item));
  let body ={
    id:item?._id
  }
  try{
    const sendres = await notifi(body);


  }catch(err){
    console.log(err);
  }
 }
 useEffect(() => {
  const timeout = setTimeout(() => {
    setvideosrc(item?.avathonsThumbnail);
    setimgsrc(item?.avathonsImage[0]);
  
  }, 5000);

  // Cleanup function to clear the timeout if the component unmounts
  return () => clearTimeout(timeout);
}, [item?.avathonsThumbnail]);



  return (
    <div className="p-4 sm:p-0 sm:mt-2">
      <div className="BoxShadowLessRounded  sm:pb-2">
        <div className="flex p-4 flex-wrap sm:p-2">
          <div className="w-[40%] relative">
          {item?.avathonsThumbnail==" "?<img className="w-[100%] aspect-[1.4] object-cover rounded-2xl" src={imgsrc}></img>:<video
                    src={ videosrc}
                    autoPlay
                    muted
                    playsInline 
                    className="w-[100%] aspect-[1.4] object-cover rounded-xl"
                  
                  />}
            {role === "avatar" && (
              <div className="absolute bottom-2 right-1 px-2 rounded-full font-bold bg-white text-sm">
                ${item?.totalPrice.toFixed(2)}
              </div>
            )}
          </div>
          <div className="w-[60%] pl-3">
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
