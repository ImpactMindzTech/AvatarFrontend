import AvatarProfileCard from "@/components/Cards/ProfileCard/AvatarProfileCard";
import HeaderBack from "@/components/HeaderBack";
import ReportProfile from "@/components/Modal/ReportProfile";
import AvatarReviewCardSwiper from "@/components/Swiper/AvatarProfileTour/AvatarReviewCardSwiper";

import Images from "@/constant/Images";
import { useEffect, useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { getAvatardetail } from "@/utills/service/userSideService/userService/UserHomeService";
import Loader from "@/components/Loader";
import TitleHeading from "@/components/Avatar/Heading/TitleHeading";
import InfiniteScroll from "react-infinite-scroll-component";
import { convertTo12HourFormats } from "@/constant/date-time-format/DateTimeFormat";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { FadeLoader } from "react-spinners";

function AvatarProfile() {
  const [multipleAddressModalState, setMultipleAddressModalState] = useState(false);
  const [avatardetail, setavatardetail] = useState({});
  const [loader, setLoader] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [tours, setTours] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const location = useLocation();
  const itemsPerPage = 10;
  const params = useParams();
  const token = localStorage.getItem("token");

  // Function to fetch avatar profile and tours
  const fetchprofile = async (page) => {
    try {
      setLoader(true);
      const avatarprofile = await getAvatardetail({
        id: params?.id,
        pg: page,
        items_per_page: itemsPerPage,
      });
 

      setLoader(false);
      if (avatarprofile?.isSuccess) {
        setavatardetail(avatarprofile.data);
        const newData = avatarprofile?.data?.Tours;

        if (newData.length < itemsPerPage || !avatarprofile?.data?.has_more) {
          setHasMore(false); // Stop infinite scroll if no more data
        }
        setTours((prev) => (page === 1 ? newData : [...prev, ...newData]));
        setTotalPages(Math.ceil(avatarprofile?.data?.total_items / itemsPerPage));
       
      }
    } catch (error) {
      console.log(error);
      setLoader(false);
    }
  };

  useEffect(() => {
    setTours([]); // Clear previous tours to prevent appending wrong data
    setCurrentPage(1); // Reset current page
    fetchprofile(1); // Initial fetch on load
  }, []); // Empty array ensures this only runs on initial load

  // Function to load more tours when scrolling
  const fetchMoreData = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      fetchprofile(currentPage + 1); // Fetch more data based on the active page
    }
  };


  const userdetails = localStorage.getItem("user");

  const from = avatardetail?.Availability?.from;
  const to = avatardetail?.Availability?.to;
  const timezone = avatardetail?.Availability?.timeZone;
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

  return (
    <>
      {loader && <Loader />}
      <div className="container">
        <HeaderBack text={"Avatar Profile"} link={""} />

        <AvatarProfileCard avatardetail={avatardetail} />
        <div className="tour">
          <div className="flex justify-between items-center">
            <h1 className="text-grey-900 sm:text-sm">{avatardetail?.Profile?.userName}</h1>
          </div>

          <TitleHeading
            title={`${avatardetail.userName ? avatardetail.userName : "Avatar"} Tours`}
          />

          <div className="my-6">
            <InfiniteScroll
              
              dataLength={tours.length}
              next={fetchMoreData}
              hasMore={currentPage < totalPages}
             
            loader={
              <div className="flex justify-center py-4 overflow-hidden">
                <FadeLoader color="#000" height={5} width={5} />
              </div>
            }
            >
              <div className="my-6 grid grid-cols-4 sm:grid-cols-1 gap-4 ">
                {tours.map((tour, index) => (
                  <div key={index} className="tour-card cursor-pointer">
                    {userdetails ? (
                      <Link to={`/user/book-experience/${tour?._id}`}>
                        <div className="">
                          <div className="images w-full relative">
                            <img
                              src={tour.thumbnail || Images.cardImageRounded}
                              alt={`${tour.name} image`}
                              className="w-full rounded-md aspect-[1.4] object-cover"
                            />
                            <div className="absolute top-auto bottom-3 left-auto right-3 z-[1] flex gap-2">
                              <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px]">
                                <b className="text-[black]">
                                  {getCurrencySymbol()}
                                  {tour?.AmountsperMinute}
                                </b>
                                /per min
                              </span>
                              {tour?.avgRating > 0 && (
                                <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm font-bold inline-flex items-center gap-2 sm:text-[12px]">
                                  <img
                                    loading="lazy"
                                    src={Images.star2}
                                    alt="star"
                                    className="w-[16px] sm:w-[12px]"
                                  />
                                  {tour?.avgRating !== "NaN" && tour?.avgRating !== 0
                                    ? Number(tour?.avgRating).toFixed(1)
                                    : " "}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start justify-between my-2 ">
                            <div className="left">
                              <h1 className="sm:text-sm">{tour?.ExperienceName}</h1>
                              <p className="text-[#ababab]">{tour?.country}</p>
                            </div>
                          </div>
                          <div className="flex  items-center justify-between">
                            <p className="text-gray-700 text-base w-[100%] lg:w-[100%] sm:text-[14px] font-medium">
                              {`${fromto} to ${too} • ${utcOffset}`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ) : (
                      <Link to={`/book-experience/${tour?._id}`}>
                        <div className="">
                          <div className="images w-full relative">
                            <img
                              src={tour.thumbnail || Images.cardImageRounded}
                              alt={`${tour.name} image`}
                              className="w-full rounded-md aspect-[1.4] object-cover"
                            />
                            <div className="absolute top-auto bottom-3 left-auto right-3 z-[1] flex gap-2">
                              <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm text-slate-500 sm:text-[12px]">
                                <b className="text-[black]">
                                  {getCurrencySymbol()}
                                  {tour?.AmountsperMinute}
                                </b>
                                /per min
                              </span>
                              {tour?.avgRating > 0 && (
                                <span className="bg-[white] px-2 pt-[4px] pb-[6px] rounded-full leading-none text-sm font-bold inline-flex items-center gap-2 sm:text-[12px]">
                                  <img
                                    loading="lazy"
                                    src={Images.star2}
                                    alt="star"
                                    className="w-[16px] sm:w-[12px]"
                                  />
                                  {tour?.avgRating !== "NaN" && tour?.avgRating !== 0
                                    ? Number(tour?.avgRating).toFixed(1)
                                    : " "}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-start justify-between my-2">
                            <div className="left">
                              <h1 className="sm:text-sm">{tour?.ExperienceName}</h1>
                              <p className="text-[#ababab]">{tour?.country}</p>
                            </div>
                          </div>
                          <div className="flex  items-center justify-between">
                            <p className="text-gray-700 text-base w-[100%] lg:w-[100%] sm:text-[14px] font-medium">
                              {`${fromto} to ${too} • ${utcOffset}`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    )}
                  </div>
                ))}
              </div>
              
            </InfiniteScroll>
          </div>
  
        </div>

   
   <TitleHeading
            title={`What users are saying about ${
              avatardetail.userName ? avatardetail.userName : "Avatar"
            }.`}
          />
          <AvatarReviewCardSwiper avatardetail={avatardetail} />

          <div
            className="BoxShadow border-grey-800 cursor-pointer mb-5"
            onClick={() => setMultipleAddressModalState(true)}
          >
            {token && (<div className="flex justify-between items-center py-5 px-3 sm:p-3">
              <div className="flex items-center gap-2 font-bold text-xl">
                <div className="">
                  <img
                    src={Images.report}
                    alt="report icon"
                    className="sm:max-h-[22px]"
                  />
                </div>
                <div className="text sm:text-sm">Report this Profile</div>
              </div>
              <div className="text-grey-800 p-2 cursor-pointer border border-grey-800 rounded-full">
                <img src={Images.arrowRight} alt="arrowRight" />
              </div>
            </div>)}
          </div>
      
      
  <ReportProfile
    multipleAddressModalState={multipleAddressModalState}
    setMultipleAddressModalState={setMultipleAddressModalState}
  />
   </div>
    </>
  );
}

export default AvatarProfile;
