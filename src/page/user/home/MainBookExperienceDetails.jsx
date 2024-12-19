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
import { mainExperienceListApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import moment from "moment-timezone";
import { convertTo12HourFormats } from "@/constant/date-time-format/DateTimeFormat";

function MainBookExperienceDetails() {
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [latLon, setLatLon] = useState(null);
  const [selectPosition, setSelectPosition] = useState(null);
  const dispatch = useDispatch();
  const experinceList = useSelector(
    (state) => state?.ExperinceProduct?.productsList
  );
  const userExperience = async () => {
    setLoading(true);
    try {
      const responce = await mainExperienceListApi(params?.id);
      if (responce?.isSuccess) {
        // setSelectPosition(responce?.data?.location);
        dispatch(setProductList(responce));
      }
    } catch (error) {
      console.log(error, "experince list error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    userExperience();
  }, []);

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

        const validPositions = updatedPositions.filter(
          (position) => position !== null
        );
        if (validPositions.length > 0) {
          setLatLon(validPositions);
        }
      }
    };
    updateCoordinates();
  }, [experinceList]);
  let detail = formatDateTime(experinceList?.data?.getAvailable?.to);


  const from = experinceList?.data?.getAvailable.from;
  const too = experinceList?.data?.getAvailable.to;

  const avatarfrom = convertTo12HourFormats(from);
  const avatarto = convertTo12HourFormats(too);

  return (
    <>
      {loading && <Loader />}
      <div className="container">
        <HeaderBack link="/" text="Book Experience" />

        {experinceList?.isSuccess &&
          experinceList?.data?.experiences?.map((item, index) => {
            setLocalStorage(
              "avatarTime",
              experinceList?.data?.getAvailable.timeZone
            );
            const averageRating = calculateAverageRating(item.Reviews);
            return (
              <div className="my-4" key={index}>
                <div className=" rounded overflow-hidden shadow-lg m-auto">
                  <SwiperSlider
                    item={item?.images}
                    hideExtraDetails={true}
                    thumnail={item?.thumbnail}
                  />
                </div>
                <div className="mt-5 relative pr-[120px]">
                  <div className="2xl:text-lg font-bold 4xl:text-xl">
                    Experience Name
                  </div>
                  <p className="font-medium text-grey-800">
                    {item?.ExperienceName}
                  </p>
                  <div className="font-semibold pt-3">
                    <p className="text-grey-800">
                      <b className="text-black">
                        {getCurrencySymbol()}
                        {item?.AmountsperMinute}{" "}
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
                    <div className="font-semibold sm:font-bold">
                      {averageRating.toFixed(1)}
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-between py-5 items-start borderTopBottom my-5">
                  <Link
                    to={`/avatar-profile/${item?.avatarId}`}
                    className="flex items-start gap-3"
                  >
                    <div className="userImg">
                      <img
                        src={item?.avatarImage || Images.avatarProfile}
                        alt="user"
                        className="w-[50px] rounded-full"
                      />
                    </div>
                    <div className="flex flex-col">
                      <h3 className="font-medium">{item?.avatarName}</h3>
                      <p className="text-grey-800">Avatar</p>
                    </div>
                  </Link>
                  <div className="max-w-[600px] mt-4 sm:max-w-full sm:w-full">
                    <h2 className="text-xl font-semibold mb-4">Availability</h2>
                    <div className="rounded-md border border-[#e2e2e2] BoxShadow py-[6px] sm:py-0 overflow-hidden sm:shadow-none">
                      <table className="table-time sm:text-[14px] table-responsive-custom">
                      <tbody>
                        <tr>
                          <th>
                            <img
                              src={Images.clock}
                              alt=""
                              className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
                            />
                            From:
                          </th>
                          <td style={{ textAlign: "right" }}>{avatarfrom}</td>
                        </tr>
                        <tr>
                          <th>
                            <img
                              src={Images.clock}
                              alt=""
                              className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
                            />
                            To:
                          </th>
                          <td style={{ textAlign: "right" }}>{avatarto}</td>
                        </tr>
                        <tr>
                          <th>
                            <img
                              src={Images.iconGlobeClock}
                              alt=""
                              className="inline-block mr-[10px] w-[24px] relative left-[-2px] sm:w-[20px]"
                            />
                            Their time zone:
                          </th>
                          <td style={{ textAlign: "right" }}>
                            {experinceList?.data?.getAvailable.timeZone}
                          </td>
                        </tr>
                        <tr>
                          <th>
                            <img
                              src={Images.clock}
                              alt=""
                              className="inline-block mr-[10px] w-[22px] sm:w-[18px]"
                            />
                            Avatar current date & time:
                          </th>
                          <td style={{ textAlign: "right" }}>
                            {getDateTimeForTimezone(
                              experinceList?.data?.getAvailable.timeZone
                            )}
                          </td>
                        </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
               
                </div>
              

                <h5 className="font-medium my-2">About this Tour</h5>
                <p className="text-grey-800 mb-5">{item?.about}</p>

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
                    {item?.State && item?.State + " ,"} {item?.country}
                  </h4>
                </div>

                <div className="reviewContainer my-5">
                  <div className="flex justify-between">
                    <div className="flex gap-2 items-center">
                      <div className="font-bold text-xl sm:text-lg">
                        Review ({averageRating.toFixed(1)})
                      </div>
                      <div className="img">
                        <img
                          src={Images.star2}
                          alt="star 2"
                          className="sm:w-5 sm:h-5"
                        />
                      </div>
                    </div>
                    <div className="font-bold text-grey-800 cursor-pointer underline">
                      {item?.Reviews?.length !== 0 && (
                        <Link to={`/see-all-review/${params?.id}`}>
                          Show All
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="">
                    <ReviewCardSwiper item={item?.Reviews} />
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
                <Link to={`/user/booking/${item?._id}`}>
                  <div className="rounded-md my-6 p-2 cursor-pointer bg-backgroundFill-900 text-white text-center">
                    <button className="py-2 font-bold">Book</button>
                  </div>
                </Link>
              </div>
            );
          })}
      </div>
    </>
  );
}

export default MainBookExperienceDetails;
