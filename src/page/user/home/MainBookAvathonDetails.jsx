import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import MapComponent from "@/components/MapComponent";
import ReviewCardSwiper from "@/components/Swiper/ReviewCardSwiper/ReviewCardSwiper";
import SwiperSlider from "@/components/Swiper/UserDashboardCardSwiper/SwiperSlider";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import {
  formatDate,
  formatDateTime,
  formatTime,
  getDateTimeForTimezone,
} from "@/constant/date-time-format/DateTimeFormat";
import Images from "@/constant/Images";
import { setProductList } from "@/store/slice/experinceS/ExperinceSlice";
import { setLocalStorage } from "@/utills/LocalStorageUtills";
import { mainExperienceListApi, useravathonApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { convertTo12HourFormats } from "@/constant/date-time-format/DateTimeFormat";
import { LatLng } from "leaflet";

function MainBookAvathonDetails() {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [latLon, setLatLon] = useState(null);
  const [selectPosition, setSelectPosition] = useState(null);
  const[details,setdetails] = useState([]);
    const [hidedetails,setHidedetails] = useState(true);
 
  const getAvathon = async () => {
    setLoading(true);
    try {
      const responce = await useravathonApi(params?.id);

      if(responce.isSuccess){
        setdetails(responce.data)
 
      }
   
    } catch (error) {
      console.log(error, "Avathon error");
    } finally {
      setLoading(false);
    }
  };




  const fetchCoordinates = async (Country, City, State) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${City},${State},${Country}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLatLon({ lat, lon }); // Directly set state here
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }
  };

  useEffect(() => {
    if (details) {
      fetchCoordinates(details?.Country, details?.City, details?.State);
    }
  }, [details]);



  useEffect(() => {
    getAvathon();
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="container">
        <HeaderBack link="/" text="Book Avathon" />

        <div className="my-4">
          <div className=" rounded overflow-hidden shadow-lg m-auto">
            <SwiperSlider
              item={details?.avathonsImage || []}
              hideExtraDetails={true}
              thumnail={details?.avathonsThumbnail}
              price={details?.AmountsperMinute}
              timezone={details?.avatarTimezone}
              avathontime={details?.avathonTime}
              eplus={details?.Eighteenplus}
              hidedetails={hidedetails}
              availableSpots={details?.Availablespots}
              product={details}
              avathonTrue={true}
            />
          </div>
          <div className="mt-5 relative pr-[120px] text-primaryColor-900">
            <div className="2xl:text-lg font-bold 4xl:text-xl">
              {details?.avathonTitle}
            </div>

            <div>
            <p className=""><span className="text-grey-800 text-base sm:text-xs font-medium">Host:</span> {details?.avatarName}</p>
            <p className="text-grey-800 text-base sm:text-xs font-medium">
                  {details?.City && details?.City + " ,"} {details.Country}
              </p>
              <p className="text-primaryColor-900 font-[450]">
                Early bird: 
                <span className="font-bold"> {getCurrencySymbol()}{details?.EarlybirdPrice}</span> | Regular <span className="font-bold">{getCurrencySymbol()}
                {details?.avathonPrice}</span>
              </p>
              
              <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs ">
                <div className="icon">
                  <img
                    src={Images.calendarIcon}
                    alt="calendarIcon"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1 text-[16px]">
                  {formatDate(details?.avathonDate)}
                </div>
              </div>
              <div className="flex items-center gap-2 py-1 sm:py-[2px] text-xs ">
                <div className="icon">
                  <img
                    src={Images.clock}
                    alt="clock"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1 text-[16px]">
                  {formatTime(details?.avathonTime?.slice(0, -1))}
                </div>
              </div>
            </div>
              
          </div>
          <div className="bg-[#F4F4F4] py-2 my-4 rounded-lg text-center text-primaryColor-900">
            <p className="text-primary-900">Please enable your webcam during the stream.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-between py-5 items-start borderTopBottom my-5">
            <Link
              to={`/avatar-profile/${details?.avatarId}`}
              className="flex items-start gap-3"
            >
              <div className="userImg">
                <img
                  src={details?.avatarImage || Images.avatarProfile}
                  alt="user"
                  className="w-[50px] rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-medium">{details?.avatarName}</h3>
                <p className="text-grey-800">{details?.aboutStream}</p>
              </div>
            </Link>
          </div>

          <div className="map">
            <h1 className="font-bold">Your Avatar Tour will be Here..</h1>
            <div className="my-3 relative z-[1]">
              <div className="centerImageIcon relative  w-full flex flex-col gap-2 justify-center">
                <div className="w-[50%] m-auto lg:w-[98%]">
                  <div className="flex w-full justify-center">
                    <div className="triangleDown"></div>
                  </div>
                </div>
              </div>
              <div className="h-[400px]">
                <MapComponent selectPosition={latLon} setHeight={true} />
              </div>
            </div>
            <h4 className="font-bold">
              {details?.State && details?.State + " ,"} {details?.Country}
            </h4>
          </div>

          {/* <div className="reviewContainer my-5">
            <div className="flex justify-between">
              <div className="flex gap-2 items-center">
                <div className="img">
                  <img
                    src={Images.star2}
                    alt="star 2"
                    className="sm:w-5 sm:h-5"
                  />
                </div>
              </div>
              <div className="font-bold text-grey-800 cursor-pointer underline"></div>
            </div>
          </div> */}
          <div className="my-2 ">
            <p className="font-semibold text-[14px] text-primary-900">Avathon Description</p>
            <p className="text-primaryColor-900">{details?.avathonDescription}</p>
          </div>
          <div className="cancel">
            <div className="cardBorder my-5">
              <div className="flex justify-between items-center py-5 sm:p-3 border-b border-borderFill-600 px-3">
                <div className="font-bold text-xl sm:text-base">
                  Cancellation Policy
                </div>
                <div className="text-grey-800 p-2 cursor-pointer border border-[#cccccc] rounded-full">
                  <img src={Images.arrowRight} alt="arrowRight" />
                </div>
              </div>
              <div className="p-4 sm:p-3">
                <p className="text-grey-800 text-md sm:text-sm">
                  In general, the refund you receive as a User when canceling an
                  Experience is 20%. From which 10% is kept by the Platform and
                  10% will be imbursed to the Avatar. However, in some cases,
                  different policies may take precedence and determine the
                  refund amount. If unforeseen circumstances beyond your control
                  compel you to cancel an Experience, you may qualify for a
                  partial or full refund under our Extenuating Circumstances
                  Policy. In the event of an Avatar cancellation, you will be
                  eligible for re-scheduling or a full refund.
                </p>
              </div>
            </div>
          </div>

          <Link to={`/user/booking/${details?._id}`}>
            <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center">
              <button className="py-2 font-bold">Join Now</button>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}

export default MainBookAvathonDetails;
