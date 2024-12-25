// After login 
import React, { useEffect, useState } from "react";
import SwiperSlider from "@/components/Swiper/UserDashboardCardSwiper/SwiperSlider";
import { Link, useNavigate } from "react-router-dom";
import Images from "@/constant/Images";
import socket from "@/utills/socket/Socket";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { bookingSlotsApi } from "@/utills/service/userSideService/userService/UserHomeService";
import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { convertTo12HourFormats, formatDate, formatTime } from "@/constant/date-time-format/DateTimeFormat";
import { getCurrencySymbol } from "@/constant/CurrencySign";

const ExperienceList = ({ product }) => {
  const [meetlink, setmeetlink] = useState("");
  const [loader, setLoader] = useState(false);
    const [hidedetails,setHidedetails] = useState(true);
  const userId = getLocalStorage("user")?._id;
  const username = getLocalStorage("user")?.userName;
  const navigate = useNavigate();

  const isNewExperience = () => {
    const currentDate = new Date();
    const createdAt = new Date(product?.createdAt);
    const differenceInDays = (currentDate - createdAt) / (1000 * 60 * 60 * 24); // Difference in days
    return differenceInDays <= 7;
  };

  const golive = async (data) => {
    navigate("/user/explore-map");
  };

  const from = product?.availability?.from;
  const to = product?.availability?.to;
  const timezone = product?.availability?.timeZone;
  const fromto = convertTo12HourFormats(from);
  const too = convertTo12HourFormats(to);

  const getUTCOffsetFromTimezone = (timezone) => {
    const now = new Date();

    const options = { timeZone: timezone, timeZoneName: "short" };
    const formatter = new Intl.DateTimeFormat([], options);

    const parts = formatter.formatToParts(now);
    const offset = parts.find((part) => part.type === "timeZoneName").value;

    return offset;
  };

  const utcOffset = getUTCOffsetFromTimezone(timezone);

  useEffect(() => {
    socket.connect();
    socket.emit("instantLive", userId);
    socket.on("getmeet", (data) => {
      setmeetlink(data.link);
    });

    return () => {
      socket.emit("userOffline", userId);
      socket.off("instantLive");
    };
  }, [userId]);

  return (
    <>
      {loader && <Loader />}
      {product?.type==="Avathons" ?
         ( 
          <div className="max-w-sm overflow-hidden sm:max-w-full h-full relative sm:border-b-2 ">
            <Link
              to={`/user/book-avathon/${product._id}`}
              className="pb-3 flex gap-4 items-center"
            >
    
              {product?.bookinstaltly && (
                <button
                  onClick={() => golive(product)}
                  className="flex items-center px-4 py-1 ms-auto bg-gradient-to-r from-red-500 to-pink-500 text-[10px] text-white font-semibold rounded-md shadow-md"
                >
                  <span className="mr-2 text-[10px] animate-pulse">
                    <img src={Images.hotsport} alt="hosport" />
                  </span>
                  Public Live
                </button>
              )}
            </Link>
            <Link to={`/user/book-avathon/${product?._id}`}>
              <div className="relative rounded-t-lg">
                {/* Swiper Slider */}
                <SwiperSlider
                  setheight={true}
                  item={product.avathonsImage || Images.cardRoundedEqual}
                  thumnail={product?.
                  avathonsThumbnail}
                  price={product.AmountsperMinute}
                  hidedetails = {hidedetails}
                  timezone ={product?.avatarTimezone}
                  avathontime = {product?.avathonTime}
                  eplus = {product?.Eighteenplus}
                  product={product}
                  avathonTrue={true}
    
                />
                {/* Show New Label */}
                    
              </div>
            </Link>
            <div className="pb-4 bg-[#001B3A] px-4 rounded-b-lg  relative">
            <img
                src={product.avatarImage || Images.user2}
                alt="user"
                className="w-[50px] h-[50px] sm:w-10 sm:h-10 rounded-full border object-cover border-white shadow-md absolute right-3 z-20 top-[-30px]"
              />
              <div className=" relative first-letter:capitalize sm:text-base">
                <Link
                  to={`/user/book-avathon/${product._id}`}
                  className="pt-4 pb-2 block font-bold text-white"
                >
                  <div className="flex items-center">              
                    {product.avathonTitle} 
                  <span className="text-white bg-[#522F44] text-[#E95658] font-normal rounded-3xl pl-2 pr-2 p-0 ml-2">Avathon</span></div>
    
                </Link>
                <p className="text-white">Host: {product?.avatarName}</p>
                
              </div>
              
              <p className="text-grey-800 text-base sm:text-xs font-medium">
                <Link to={`/user/book-avathon/${product._id}`}>
                  {product?.City && product?.City + " ,"} {product.Country}
                </Link>
              </p>
              <p className="text-[#FFFFFF]">
               Early bid: {getCurrencySymbol()}{product?.EarlybirdPrice}  | Regular {getCurrencySymbol()}{product?.avathonPrice}
              </p>
              {/* <img src={Images.info} className=""/> */}
          <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs text-[#FFFFFF] ">
                        <div className="icon">
                          <img
                            src={Images.whitecalender}
                            alt="calendarIcon"
                            className="w-5 h-5"
                          />
                        </div>
                        <div className="flex-1 text-[16px]">{formatDate(product?.avathonDate)}</div>
                      </div>
                      <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs text-[#FFFFFF]">
                        <div className="icon">
                          <img src={Images.whiteclock} alt="clock" className="w-5 h-5" />
                        </div>
                        <div className="flex-1 text-[16px]">
                          {formatTime(product?.avathonTime.slice(0, -1))}
                        </div>
                      </div>
                      
                        <button className="bg-white text-black p-5 pt-2 pb-2 rounded-md font-bold text-[16px] absolute right-3 bottom-2" onClick={() => navigate(`/user/book-avathon/${product._id}`)}
                        >Join Now
                         </button>
                      
            </div>
          </div>
      ):(<div className="max-w-sm overflow-hidden sm:max-w-full h-full relative sm:border-b-2">
        <Link
          to={`/user/book-experience/${product._id}`}
          className="pb-3 flex gap-4 items-center"
        >
          <img
            loading="lazy"
            src={product.avatarImage || Images.user2}
            alt="user"
            className="w-[50px] h-[50px] sm:w-10 sm:h-10 rounded-full border object-cover border-white shadow-md"
          />
          <h2 className="font-bold">{product.avatarName}</h2>{" "}
          {product?.bookinstaltly && (
            <button
              onClick={() => golive(product)}
              className="flex items-center px-4 py-1 ms-auto bg-gradient-to-r from-red-500 to-pink-500 text-[10px] text-white font-semibold rounded-md shadow-md"
            >
              <span className="mr-2 text-[10px] animate-pulse">
                <img src={Images.hotsport} alt="hosport" loading="lazy" />
              </span>
              Public Live
            </button>
          )}
        </Link>
        <Link to={`/user/book-experience/${product?._id}`}>
          <div className="relative">
            <SwiperSlider
              setheight={true}
              item={product.images || Images.cardRoundedEqual}
              thumnail={product?.thumbnail}
              price={product.AmountsperMinute}
              avrrating={product.avgRating}
            />
            {/* Show New Label */}
            {isNewExperience() && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md shadow-md z-10">
                New
              </span>
            )}
          </div>
        </Link>
        <div className="pb-4">
          <div className="font-bold text-xl relative first-letter:capitalize sm:text-base">
            <Link
              to={`/user/book-experience/${product._id}`}
              className="pt-4 pb-2 block"
            >
              {product.ExperienceName}
            </Link>
          </div>
          <p className="text-grey-800 text-base sm:text-xs font-medium">
            <Link to={`/user/book-experience/${product._id}`}>
              {product?.city && product?.city + " ,"} {product.country}
            </Link>
          </p>
          <div className="flex  items-center justify-between">
            <p className="text-gray-700 text-base w-[100%] lg:w-[100%] sm:text-[13px] font-medium">
              {`${fromto} to ${too} • ${utcOffset}`}
            </p>
          </div>
        </div>
      </div>)}
    </>
  );
};

export default ExperienceList;
