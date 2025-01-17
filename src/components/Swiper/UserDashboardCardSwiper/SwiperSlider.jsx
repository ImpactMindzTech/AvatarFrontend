
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Images from "@/constant/Images";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { getDateTimeForTimezone } from "@/constant/date-time-format/DateTimeFormat";
import { deleteAvathonsApi } from "@/utills/service/avtarService/CreateAvathonsService";
import moment from 'moment-timezone'
import { useEffect, useRef, useState } from "react";
import { ConstructionOutlined } from "@mui/icons-material";
function SwiperSlider({
  item,
  product,
  setheight,
  thumnail,
  price,
  timezone,
  avathontime,
  eplus,
  avrrating  ,hidedetails
,
  hideExtraDetails,
  avathonTrue,
  availableSpots
}) {
 
  let slides;
 if(thumnail==" "){

    slides = [...item];
 }else{
  
  slides = [thumnail,...item];
 }

  const [startCountdown, setStartCountdown] = useState("");
  const [endCountdown, setEndCountdown] = useState("");
  const timezones = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const endTime = product?.endEvent;
  let avatartimezone = timezone || timezones;
let count =0;
  const getRemainingTime = (targetTime, currentTime) => {
    // Calculate the difference
    const timeDifference = targetTime.diff(currentTime); // The difference in milliseconds
  
    if (timeDifference < 0) {
      // If the time difference is negative, return "Event ended" or "Event started"
      return "Event Started";
    }
  
    // Convert the difference to hours, minutes, and seconds
    const duration = moment.duration(timeDifference);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
  
    // Format the result as a string
    return `${hours}hrs : ${minutes}min : ${seconds}sec`;
  };


  const getExactTimeForTimezone = (timezone) => {
    const date = new Date();
    return date.toLocaleString('en-US', { timeZone: timezone });
  };
  
  const updateCountdowns = async() => {
    const exacttime = getExactTimeForTimezone(avatartimezone); 


    // Get the current time for 
    const avathonMoment = moment.tz(avathontime, timezone); 
    
    // Convert avathontime to a moment object in the same timezone
    const exactMoment = moment.tz(exacttime, timezone); // Convert exacttime to a moment object in the specified timezone
    const endMoment = moment.tz(endTime, timezone); // Convert endTime to a moment object in the same timezone
  console.log(endMoment);
    // Update start countdown
    const startCountdown = getRemainingTime(avathonMoment, exactMoment);
    setStartCountdown(startCountdown);

    // Update end countdown
    const endCountdown = getRemainingTime(endMoment, exactMoment);
    setEndCountdown(endCountdown);

    if (endMoment.diff(exactMoment) <= 0 && count<1 && product?.type=="Avathons") {
         count++;
      try {
    // Mark the API as called
        const response = await deleteAvathonsApi(product?._id);
      
        
      } catch (err) {
        console.error("Error calling deleteAvathonsApi:", err);
      }
    }

  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      updateCountdowns();
  
      // If both events have ended, clear the interval
      if (startCountdown === "Event Started" && endCountdown === "Event Started") {
        clearInterval(interval);
      }
    }, 1000);
  
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [avathontime, timezone, endTime]);
  
const averageRating =  avrrating;
const joinedmember = product?.joinedMembers;
const availablemember = product?.Availablespots ;
const totalremainspots = availablemember-joinedmember;
const videoRef = useRef(null);

const handleFullscreen = () => {
  if (videoRef.current) {
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.mozRequestFullScreen) { // Firefox
      videoRef.current.mozRequestFullScreen();
    } else if (videoRef.current.webkitRequestFullscreen) { // Chrome, Safari, Opera
      videoRef.current.webkitRequestFullscreen();
    } else if (videoRef.current.msRequestFullscreen) { // IE/Edge
      videoRef.current.msRequestFullscreen();
    }
  }
};

  return (
    <Swiper  pagination={{ clickable: true}}  modules={[Pagination]} className={`${avathonTrue ?'avathonCustomdots':'mySwiper z-10'} `} navigation>
      {slides?.map((src, index) => {
   
        return (
          <SwiperSlide key={index}>
  {src?.endsWith('.mp4') || src?.endsWith('.webm') ? (
    <>
    <video
      className={`aspect-video object-cover m-auto w-full ${avathonTrue?'rounded-t-lg':'rounded-lg'}`}
      src={src}
      ref={videoRef}
      loading="lazy"
      alt="slider_video"
      autoPlay
      muted
      playsInline 
      controlsList="fullscreen"
      loop
      onClick={handleFullscreen}
    >
      
    </video>
     
     </>
    
  ) : (
    <img
      loading="lazy"
      className={`aspect-video object-cover m-auto w-full ${avathonTrue?'rounded-t-lg':'rounded-lg'}`}
      src={src || Images.imagePlaceholder}
      alt="slider_img"
    />
  )}
</SwiperSlide>

        );
      })}
      {!hideExtraDetails && !hidedetails &&(
        <div className="absolute top-auto bottom-3 left-auto right-3 z-[1] flex gap-2">
          <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px]">
            <b className="text-[black]">
              {getCurrencySymbol()}
              {price}
            </b>
            /per min
          </span>
         
  <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm font-bold inline-flex items-center gap-2 sm:text-[12px]">
    <img
      loading="lazy"
      src={Images.star2}
      alt="star"
      className="w-[16px] sm:w-[12px]"
    />
    {averageRating !== "NaN" && averageRating !== 0
      ? Number(averageRating).toFixed(1)
      : "No Ratings"}
  </span>




        </div>
      )}
    {hidedetails==true ?(
      <>
      <div className="absolute top-3  left-3 z-[1] flex w-[93%] justify-between">
      <div className="bg-[white] px-4 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px] text-[14px]">
        <p className="text-start">
          Starts in:<br></br>
        
        </p>
        <p className="mt-1"> {startCountdown}</p>
  
       
      </div>
     {totalremainspots===0?(''
):( <div className="bg-[white] px-4  pt-[4px] pb-[6px] rounded-full leading-none text-sm inline-flex items-center gap-2 sm:text-[12px]">

<p>
🔥 Only {totalremainspots} available
<p className="text-end mt-1">spots left</p>
</p>
</div>
)}



    </div>
  <div>
    {eplus &&(
    <div className="bg-[white] px-4  pt-[4px] pb-[6px] rounded-full leading-none text-sm font-bold inline-flex items-center gap-2 sm:text-[12px] z-20 absolute bottom-1 left-3">18+</div>
)}
  </div>
  </>
  
  
  
  
  ):(  <div className="absolute top-auto bottom-3 left-auto right-3 z-[1] flex gap-2">

        {/* <span className="bg-[white] px-4 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px]">
          <b className="text-[black]">
            {getCurrencySymbol()}
            {price}
          </b>
          /per min
        </span> */}
       
{/* <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm font-bold inline-flex items-center gap-2 sm:text-[12px]">
  <img
    loading="lazy"
    src={Images.star2}
    alt="star"
    className="w-[16px] sm:w-[12px]"
  />
  {averageRating !== "NaN" && averageRating !== 0
    ? Number(averageRating).toFixed(1)
    : "No Ratings"}
</span> */}




      </div>)}
    </Swiper>
  );
}

export default SwiperSlider;

