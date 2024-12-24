import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import MapComponent from "@/components/MapComponent";
import ReviewCardSwiper from "@/components/Swiper/ReviewCardSwiper/ReviewCardSwiper";
import SwiperSlider from "@/components/Swiper/UserDashboardCardSwiper/SwiperSlider";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import {
  formatDateTime,
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
  const[details,setdetails] = useState(null);
 
  const userExperience = async () => {
    setLoading(true);
    try {
      const responce = await useravathonApi(params?.id);
      if(responce.isSuccess){
        setdetails(responce.data)
 
      }
   
    } catch (error) {
      console.log(error, "experince list error");
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
    userExperience();
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
                  />
                </div>
                <div className="mt-5 relative pr-[120px]">
                  <div className="2xl:text-lg font-bold 4xl:text-xl">
                    Avathon Name
                  </div>
                  <p className="font-medium text-grey-800">
                    {details?.avathonTitle}
                  </p>
                  <div className="font-semibold pt-3">
                    <p className="text-grey-800">
                      <b className="text-black">
                        {getCurrencySymbol()}
                        {details?.avathonPrice}{" "}
                      </b>
                      per minute
                    </p>
                  </div>
                  <div className="absolute top-0 left-auto right-0 flex items-center px-4 py-1 justify-center gap-2 bg-borderFill-900 rounded-full sm:px-2 sm:leading-none sm:py-[5px] sm:text-xs sm:mt-[5px]">
                    <div className="border-r-2 px-1 sm:pl-0">
                      <img
                        src={Images.star2}
                        alt="star"
                        className="w-5 h-6 sm:w-3 sm:h-3"
                      />
                    </div>

                  </div>
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
                      <p className="text-grey-800">Avatar</p>
                    </div>
                  </Link>
                  <div className="max-w-[600px] mt-4 sm:max-w-full sm:w-full">
                    <h2 className="text-xl font-semibold mb-4">Availability</h2>
                    <div className="rounded-md border border-[#e2e2e2] BoxShadow py-[6px] sm:py-0 overflow-hidden sm:shadow-none">
                    
                    </div>
                  </div>
               
                </div>
              

                <h5 className="font-medium my-2">About this Tour</h5>
                <p className="text-grey-800 mb-5">{details?.about}</p>

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
                    {details?.State && details?.State + " ,"} {details?.country}
                  </h4>
                </div>

                <div className="reviewContainer my-5">
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
                    <div className="font-bold text-grey-800 cursor-pointer underline">
                
                    </div>
                  </div>

             
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
                        In general, the refund you receive as a User when
                        canceling an Experience is 20%. From which 10% is kept
                        by the Platform and 10% will be imbursed to the Avatar.
                        However, in some cases, different policies may take
                        precedence and determine the refund amount. If
                        unforeseen circumstances beyond your control compel you
                        to cancel an Experience, you may qualify for a partial
                        or full refund under our Extenuating Circumstances
                        Policy. In the event of an Avatar cancellation, you will
                        be eligible for re-scheduling or a full refund.
                      </p>
                    </div>
                  </div>
                </div>
                <Link to={`/user/report/${params?.id}`}>
                  <div className="BoxShadow">
                    <div className="flex justify-between items-center py-5 px-3 sm:p-3">
                      <div className="flex items-center gap-2 font-bold text-xl">
                        <div className="">
                          <img
                            src={Images.report}
                            alt="report icon"
                            className="sm:max-h-[22px]"
                          />
                        </div>
                        <div className="text sm:text-base">
                          Report this Listing
                        </div>
                      </div>
                      <div className="text-grey-800 p-2 cursor-pointer border border-[#cccccc] rounded-full">
                        <img src={Images.arrowRight} alt="arrowRight" />
                      </div>
                    </div>
                  </div>
                </Link>
                <Link to={`/user/booking/${details?._id}`}>
                  <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center">
                    <button className="py-2 font-bold">Book</button>
                  </div>
                </Link>
              </div>

         
      </div>
    </>
  );
}

export default MainBookAvathonDetails;
