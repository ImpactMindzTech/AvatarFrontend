import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import MapComponent from "@/components/MapComponent";
import ReviewCardSwiper from "@/components/Swiper/ReviewCardSwiper/ReviewCardSwiper";
import SwiperSlider from "@/components/Swiper/UserDashboardCardSwiper/SwiperSlider";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import {
  formatDateTime,
  formatTimestamp,
  convertTo12HourFormats,
  getDateTimeForTimezone,
  formatTime,
  formatDate,
} from "@/constant/date-time-format/DateTimeFormat";
import Images from "@/constant/Images";
import { setProductList } from "@/store/slice/experinceS/ExperinceSlice";
import { getLocalStorage, setLocalStorage } from "@/utills/LocalStorageUtills";
import { Joinavathon, useravathonApi, userExperienceListApi } from "@/utills/service/userSideService/userService/UserHomeService";
import socket from "@/utills/socket/Socket";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";

function Book_Avathon_Details() {
  const params = useParams();
 

  const [loading, setLoading] = useState(false);
  const [latLon, setLatLon] = useState(null);
  const [selectPosition, setSelectPosition] = useState(null);
  const[details,setdetails] = useState([]);
  const [hidedetails,setHidedetails] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const experinceList = useSelector(
    (state) => state?.ExperinceProduct?.productsList
  );
  const userExperience = async () => {
    setLoading(true);
    try {
      const responce = await useravathonApi(params?.id);
   console.log(responce);
      if(responce.isSuccess){
      
        setdetails(responce.data)
 
      }
   
    } catch (error) {
      console.log(error, "avathon error");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    userExperience();
  }, []);
const handlejoin = async(details)=>{
  try{
    let userID = getLocalStorage("user")?._id;
    socket.emit("uid",{details,userID});

    let res = await Joinavathon(details?._id);
    if(res.isSuccess){
      navigate(`/user/avathon-confirm-and-pay/`, { state: { details } })
      toast.success(res.message);
    }
    else{
      toast.error(res.message);
    }
  }catch(err){
    toast.error(err)
  }
}
  const from = experinceList?.data?.getAvailable.from; // 11:00 AM UTC
  const too = experinceList?.data?.getAvailable.to; // 7:00 PM UTC

  const avatarfrom = convertTo12HourFormats(from);
  const avatarto = convertTo12HourFormats(too);

  // Function to calculate the average rating
  const calculateAverageRating = (reviews) => {
    if (!reviews.length) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  const fetchCoordinates = async (country, city, state) => {
    try {
      // const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${country},${city},${state}%20india&format=json&limit=1`);
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${city},${state},${country}&format=json&limit=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return { lat, lon };
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  useEffect(() => {
    const updateCoordinates = async () => {
      if (experinceList?.data?.experiences) {
        const updatedPositions = await Promise.all(
          experinceList.data.experiences.map(async (item) => {
            const coords = await fetchCoordinates(
              item?.country,
              item?.city,
              item?.State
            );
            return coords;
          })
        );

        // Filter out invalid coordinates
        const validPositions = updatedPositions.filter(
          (position) => position !== null
        );
        if (validPositions.length > 0) {
          setLatLon(validPositions); // Set the first valid position or handle as needed
        }
      }
    };
    updateCoordinates();
  }, [experinceList]);
console.log(details)
  return (
    // <>
    //   {loading && <Loader />}
    //   <div className="container">
    //     <HeaderBack link="/" text="Book Avathon" />

    //     {experinceList?.isSuccess &&
    //       experinceList?.data?.experiences?.map((item, index) => {
    //         setLocalStorage(
    //           "avatarTime",
    //           experinceList?.data?.getAvailable.timeZone
    //         );
    //         const averageRating = calculateAverageRating(item.Reviews);
    //         return (
    //           <div className="my-4" key={index}>
    //             <div className=" rounded overflow-hidden shadow-lg m-auto">
    //               <SwiperSlider
    //                 item={item?.images}
    //                 thumnail={item?.thumbnail}
    //                 hideExtraDetails={true}
    //               />
    //             </div>
    //             <div className="mt-5 relative pr-[120px]">
    //               <div className="2xl:text-lg font-bold 4xl:text-xl">
    //                 Avathon Name
    //               </div>
    //               <p className="font-medium text-grey-800">
    //                 {item?.ExperienceName}
    //               </p>
    //               <div className="font-semibold pt-3">
    //                 <p className="text-grey-800">
    //                   <b className="text-black">
    //                     {getCurrencySymbol()}
    //                     {item?.AmountsperMinute}{" "}
    //                   </b>
    //                   per minute
    //                 </p>
    //               </div>
    //               <div className="absolute top-0 left-auto right-0 flex items-center px-4 py-1 justify-center gap-2 bg-borderFill-900 rounded-full sm:px-2 sm:leading-none sm:py-[5px] sm:text-xs sm:mt-[5px]">
    //                 <div className="border-r-2 px-1 sm:pl-0">
    //                   <img
    //                     src={Images.star2}
    //                     alt="star"
    //                     className="w-5 h-6 sm:w-3 sm:h-3"
    //                   />
    //                 </div>
    //                 <div className="font-semibold sm:font-bold">
    //                   {averageRating.toFixed(1)}
    //                 </div>
    //               </div>
    //             </div>
    //             <div className="flex flex-wrap gap-2 justify-between py-5 items-start borderTopBottom my-5">
    //               <Link
    //                 to={`/user/avatar-profile/${item?.avatarId}`}
    //                 className="flex items-start gap-3"
    //               >
    //                 <div className="userImg">
    //                   <img
    //                     src={item?.avatarImage || Images.avatarProfile}
    //                     alt="user"
    //                     className="w-[50px] rounded-full aspect-square"
    //                   />
    //                 </div>
    //                 <div className="flex flex-col">
    //                   <h3 className="font-medium">{item?.avatarName}</h3>
    //                   <p className="text-grey-800">{item?.about}</p>
    //                 </div>
    //               </Link>
    //               <div className="max-w-[600px] mt-4 sm:max-w-full sm:w-full">
    //                 <h2 className="text-xl font-semibold mb-4">Availability</h2>
    //                 <div className="rounded-md border border-[#e2e2e2] BoxShadow py-[6px] sm:py-0 overflow-hidden sm:shadow-none">
    //                   <table className="table-time sm:text-[14px] table-responsive-custom">
    //                     <tr>
    //                       <th>
    //                         <img
    //                           src={Images.clock}
    //                           alt=""
    //                           className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
    //                         />
    //                         From:
    //                       </th>
    //                       <td style={{ textAlign: "right" }}>{avatarfrom}</td>
    //                     </tr>
    //                     <tr>
    //                       <th>
    //                         <img
    //                           src={Images.clock}
    //                           alt=""
    //                           className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
    //                         />
    //                         To:
    //                       </th>
    //                       <td style={{ textAlign: "right" }}>{avatarto}</td>
    //                     </tr>
    //                     <tr>
    //                       <th>
    //                         <img
    //                           src={Images.iconGlobeClock}
    //                           alt=""
    //                           className="inline-block mr-[10px] w-[24px] relative left-[-2px] sm:w-[20px]"
    //                         />
    //                         Their time zone:
    //                       </th>
    //                       <td style={{ textAlign: "right" }}>
    //                         {experinceList?.data?.getAvailable.timeZone}
    //                       </td>
    //                     </tr>
    //                     <tr>
    //                       <th>
    //                         <img
    //                           src={Images.clock}
    //                           alt=""
    //                           className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
    //                         />
    //                         Avatar current date & time:
    //                       </th>
    //                       <td style={{ textAlign: "right" }}>
    //                         {getDateTimeForTimezone(
    //                           experinceList?.data?.getAvailable.timeZone
    //                         )}
    //                       </td>
    //                     </tr>
    //                   </table>
    //                 </div>
    //               </div>
                  
    //             </div>
               

    //             <h5 className="font-medium my-2">About this Tour</h5>
    //             <p className="text-grey-800 mb-5">{item?.about}</p>

    //             <div className="map">
    //               <h1 className="font-bold">Your Avatar Tour will be Here..</h1>
    //               <div className="my-3 relative z-[1]">
    //                 <div className="centerImageIcon relative  w-full flex flex-col gap-2 justify-center">
    //                   <div className="w-[50%] m-auto lg:w-[98%]">
           
    //                     <div className="flex w-full justify-center">
    //                       <div className="triangleDown"></div>
    //                     </div>
    //                   </div>
    //                   {/* <div className="flex justify-center">
    //                     <img src={Images.homeIcon} alt="home icon" className="cursor-pointer lg:w-10 lg:h-10" />
    //                   </div> */}
    //                 </div>
    //                 <div className="h-[400px]">
    //                   <MapComponent selectPosition={latLon} setHeight={true} />
    //                 </div>
    //               </div>
    //               <h4 className="font-bold">
    //                 {item?.State && item?.State + " ,"} {item?.country}
    //               </h4>
    //             </div>

    //             <div className="reviewContainer my-5">
    //               <div className="flex justify-between">
    //                 <div className="flex gap-2 items-center">
    //                   <div className="font-bold text-xl sm:text-lg">
    //                     Review ({averageRating.toFixed(1)})
    //                   </div>
    //                   <div className="img">
    //                     <img
    //                       src={Images.star2}
    //                       alt="star 2"
    //                       className="sm:w-5 sm:h-5"
    //                     />
    //                   </div>
    //                 </div>
    //                 <div className="font-bold text-grey-800 cursor-pointer underline">
    //                   {item?.Reviews?.length !== 0 && (
    //                     <Link to={`/user/see-all-review/${params?.id}`}>
    //                       Show All
    //                     </Link>
    //                   )}
    //                 </div>
    //               </div>

    //               <div className="">
    //                 <ReviewCardSwiper item={item?.Reviews} />
    //               </div>
    //             </div>

    //             <div className="cancel">
    //               <div className="cardBorder my-5">
    //                 <div className="flex justify-between items-center py-5 sm:p-3 border-b border-borderFill-600 px-3">
    //                   <div className="font-bold text-xl sm:text-base">
    //                     Cancellation Policy
    //                   </div>
    //                   <div className="text-grey-800 p-2 cursor-pointer border border-[#cccccc] rounded-full">
    //                     <img src={Images.arrowRight} alt="arrowRight" />
    //                   </div>
    //                 </div>
    //                 <div className="p-4 sm:p-3">
    //                   <p className="text-grey-800 text-md sm:text-sm">
    //                     In general, the refund you receive as a User when
    //                     canceling an Experience is 20%. From which 10% is kept
    //                     by the Platform and 10% will be imbursed to the Avatar.
    //                     However, in some cases, different policies may take
    //                     precedence and determine the refund amount. If
    //                     unforeseen circumstances beyond your control compel you
    //                     to cancel an Experience, you may qualify for a partial
    //                     or full refund under our Extenuating Circumstances
    //                     Policy. In the event of an Avatar cancellation, you will
    //                     be eligible for re-scheduling or a full refund.
    //                   </p>
    //                 </div>
    //               </div>
    //             </div>
    //             <Link to={`/user/report/${params?.id}`}>
    //               <div className="BoxShadow">
    //                 <div className="flex justify-between items-center py-5 px-3 sm:p-3">
    //                   <div className="flex items-center gap-2 font-bold text-xl">
    //                     <div className="">
    //                       <img
    //                         src={Images.report}
    //                         alt="report icon"
    //                         className="sm:max-h-[22px]"
    //                       />
    //                     </div>
    //                     <div className="text sm:text-base">
    //                       Report this Listing
    //                     </div>
    //                   </div>
    //                   <div className="text-grey-800 p-2 cursor-pointer border border-[#cccccc] rounded-full">
    //                     <img src={Images.arrowRight} alt="arrowRight" />
    //                   </div>
    //                 </div>
    //               </div>
    //             </Link>
    //             <Link to={`/user/booking/${item?._id}`}>
    //               <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center">
    //                 <button className="py-2 font-bold">Book</button>
    //               </div>
    //             </Link>
    //           </div>
    //         );
    //       })}
    //   </div>
    // </>
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
              timezone={details?.avtTimezone }
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
                  {formatTime(details?.avathonTime)}
                </div>
              </div>
            </div>
              
          </div>
          <div className="bg-[#F4F4F4] py-2 my-4 rounded-lg text-center text-primaryColor-900">
            <p className="text-primary-900">Please enable your webcam during the stream.</p>
          </div>
          <div className="flex flex-wrap gap-2 justify-between py-5 items-start borderTopBottom my-5">
            <Link
              to={`/user/avatar-profile/${details?.avatarId}`}
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
{/* 
          <Link to={`/user/avathon-confirm-and-pay/${details?._id}`}>
            <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center">
              <button className="py-2 font-bold" >Join Now</button>
            </div>
          </Link> */}
              {/* <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center" onClick={() => navigate(`/user/avathon-confirm-and-pay/${details?._id}`, { state: { details } })}>
              <button className="py-2 font-bold" >Join Now</button>
            </div> */}
                          {/* <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center" onClick={() => navigate(`/user/avathon-confirm-and-pay/`, { state: { details } })}>
              <button className="py-2 font-bold" >Join Now</button>
            </div> */}
                          <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center" onClick={() =>handlejoin(details)}>
              <button className="py-2 font-bold" >Join Now</button>
            </div>
        </div>
      </div>
    </>
  );
}

export default Book_Avathon_Details;
