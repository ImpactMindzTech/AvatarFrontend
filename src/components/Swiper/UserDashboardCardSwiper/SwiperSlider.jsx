
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import Images from "@/constant/Images";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { getDateTimeForTimezone } from "@/constant/date-time-format/DateTimeFormat";
import moment from 'moment-timezone'
import { useEffect, useState } from "react";
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
 
  const slides = [thumnail,...item];

  const [countdown, setCountdown] = useState("");
  const timezones = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let avatartimezone = timezone || timezones;
  const getRemainingTime = () => {
    const exacttime = getDateTimeForTimezone(avatartimezone); // Get the current time for the avatar's timezone
    const mytime = avathontime; // This is the avathon start time
  
    // Parse both times using moment
    const avathonMoment = moment.tz(mytime, timezone); // Convert avathontime to a moment object in the same timezone
    const exactMoment = moment.tz(exacttime, timezone); // Convert exacttime to a moment object in the specified timezone
  
    // Calculate the difference
    let timeDifference = avathonMoment.diff(exactMoment); // The difference in milliseconds
  
    if (timeDifference < 0) {
      // If the time difference is negative, return "Event started"
      return "Event started";
    }
  
    // Convert the difference to hours, minutes, and seconds
    const duration = moment.duration(timeDifference);
    const hours = Math.floor(duration.asHours());
    const minutes = duration.minutes();
    const seconds = duration.seconds();
  
    // Format the result as a string
    const formattedDifference = `${hours}hrs : ${minutes}min : ${seconds}sec`;
    return formattedDifference;
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const newCountdown = getRemainingTime();
      setCountdown(newCountdown);
  
      // If the event has started, stop the countdown
      if (newCountdown === "Event started") {
        clearInterval(interval);
      }
    }, 1000);
  
    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [avathontime, timezone]);
  
const averageRating =  avrrating;
const joinedmember = product?.joinedMembers;
const availablemember = product?.Availablespots ;
const totalremainspots = availablemember-joinedmember;


  return (
    <Swiper  pagination={{ clickable: true}}  modules={[Pagination]} className={`${avathonTrue ?'avathonCustomdots':'mySwiper z-10'} `} navigation>
      {slides?.map((src, index) => {
   
        return (
          <SwiperSlide key={index}>
  {src?.endsWith('.mp4') || src?.endsWith('.webm') ? (
    <video
      className={`aspect-video object-cover m-auto w-full ${avathonTrue?'rounded-t-lg':'rounded-lg'}`}
      src={src}
 
      loading="lazy"
      alt="slider_video"
      autoPlay
      muted
    >
      Your browser does not support the video tag.
    </video>
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
        <p className="mt-1"> {countdown}</p>
       
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

        <span className="bg-[white] px-4 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px]">
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




      </div>)}
    </Swiper>
  );
}

export default SwiperSlider;

