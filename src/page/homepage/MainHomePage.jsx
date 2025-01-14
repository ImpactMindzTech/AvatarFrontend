// before login
import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/store/slice/experinceS/ExperinceSlice";
import { userExperienceApi } from "@/utills/service/userSideService/userService/UserHomeService";
import Loader from "@/components/Loader";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import MultipleAddressModal from "@/components/Modal/MultipleAddressModal";
import InstantLiveRequestModal from "@/components/Modal/InstantLiveRequestModal";
import socket from "@/utills/socket/Socket";
import MeetingNotification from "@/components/Modal/MeetingNotification";
import InfiniteScroll from "react-infinite-scroll-component"; 
import { FadeLoader } from "react-spinners";
import { useNavigate, useLocation } from "react-router-dom"; 
import ExperienceList from "../user/home/ExperienceList";
import MainTopSearch from "@/components/UserTopSearch/MainTopSearch";
import MainExperienceList from "../user/home/MainExperienceList";

const MainHomePage = () => {
  const isCountryChanged = useSelector((state) => state.countrychanged);

  const navigate = useNavigate();
  const location = useLocation(); 

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [instantLiveModalState, setInstantLiveModalState] = useState(false);
  const [multipleAddressModalState, setMultipleAddressModalState] =
    useState(false);
  const [activeTab, setActiveTab] = useState("Feature Event");
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [meetlink, setmeetlink] = useState("");
  const [instant, setinstantrequest] = useState([]);
  const [item, setItemdata] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [country, setCountry] = useState(
    getLocalStorage("selectedCountry") 
  );

  const [showNotice, setShowNotice] = useState(true);
  
  // Define tabs
  const tabs = [
  
    { key: "Feature Event", query: "featureevent" },
    { key: "All", query: "all" },
    { key: "Popular", query: "popular" },
    { key: "Recommended", query: "recommended" },
    { key: "Mostbooked", query: "mostbooked" },
    { key: "Recent", query: "recent" }
  ];

  const userId = getLocalStorage("user")?._id;

  // Extract tab from URL query parameters
  const getQueryTab = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("tab")?.toLowerCase() || "featureevent";
  };

  const fetchUserExperience = useCallback(
    async (tab, page) => {
      const country =
        getLocalStorage("selectedCountry") || getLocalStorage("user")?.Country||"United States";
      
      const payload = {
        tab: tab.replace(/\s+/g, ''),
        country: country,
        search: search,
        page: page,
        items_per_page: itemsPerPage,
      };
 
      try {
        setLoading(true)
        const activeUserId = getLocalStorage("user")?._id;
        const response = await userExperienceApi(payload);

        if (response?.isSuccess) {
          let filterData = response.data.filter(
            (item) => item.avatarId !== activeUserId
          );
          let onlyAvailabilityData = filterData.filter(
            (item) => item.availability !== null
          );

          setLocalData((prevData) => {
            const mergedData = [...prevData, ...onlyAvailabilityData];

            const uniqueData = Array.from(
              new Map(mergedData.map((item) => [item._id, item])).values()
            );

            return uniqueData;
          });

          setTotalPages(Math.ceil(response.total_items / itemsPerPage));
        }
      } catch (error) {
        console.error(error);
      }
      finally{
        setLoading(false)

      }
    },
    [country, search, itemsPerPage]
  );

  useEffect(() => {
    const activeTabQuery = getQueryTab(); 

    setActiveTab(tabs.find((t) => t.query === activeTabQuery)?.key || "Feature Event");

    setCurrentPage(1);
    setTotalPages(1);
    setLocalData([]);
    fetchUserExperience(activeTabQuery, 1);
  }, [location.search, fetchUserExperience]); 

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    navigate(`?tab=${tab.toLowerCase()}`);
    setLocalData([]); // Clear the previous data
  };

  const handleCountryUpdate = useCallback(() => {
    const storedCountry = getLocalStorage("selectedCountry")||"United States";
    if (storedCountry && storedCountry !== country) {
      setCountry(storedCountry);
    }
  }, [country,isCountryChanged]);

  useEffect(() => {
    socket.connect();
    handleCountryUpdate();
    window.addEventListener("storage", handleCountryUpdate);
    return () => {
      window.removeEventListener("storage", handleCountryUpdate);
    };
  }, [handleCountryUpdate]);


  useEffect(() => {
    socket.emit("instantLive", userId);
    socket.emit("userOnline", userId);
    socket.on("getmeet", (data) => {
      setinstantrequest(data);

      if (data?.length !== 0) {
        setInstantLiveModalState(true);
      }
    });
    socket.on("requestAvatarApproved", (data) => {});
    socket.on("meetLink", (data) => {
      setmeetlink(data.link);
      setItemdata(data);
      if (data !== null) {
        setShowNotification(true);
      }
    });
    return () => {
      socket.emit("userOffline", userId);
      socket.off("instantLive");
    };
  }, [userId]);

  const fetchMoreData = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
      const activeTabQuery = tabs.find((t) => t.key === activeTab)?.query;
      fetchUserExperience(activeTabQuery, currentPage + 1);
    }
  };

  const handleJoin = () => {
    window.open(meetlink, "_blank");
    setShowNotification(false);
  };

  const handleCancel = () => {
    setShowNotification(false);
  };

  return (
    <>
      {loading && <Loader />}
      {showNotice && (
  <div className="bg-yellow-200 p-4 rounded-md text-black text-sm flex justify-between items-center mb-4">
    <p>
      You are using the beta version of our application. We’re actively working to improve it, If you encounter any bugs, please report them using the "Report a Bug" option in the navigation menu. Your feedback is invaluable to us!
    </p>
    <button onClick={() => setShowNotice(false)} className="text-xl font-bold text-gray-800">
      &times;
    </button>
  </div>
)}

      <div className="container ">
        <MainTopSearch onSearch={setSearch} />
        <div className="lg:overflow-x-auto lg:overflow-y-hidden border-b ">
          <div className="flex border-b">
            {tabs.map(({ key }) => (
              <button
                key={key}
                className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap ${
                  activeTab === key
                    ? "border-primaryColor-900 text-primaryColor-900 font-bold"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => handleTabClick(key)} // Handle tab click properly
              >
                {key}
              </button>
            ))}
          </div>
        </div>
        <div className="-mx-4 ">
          <InfiniteScroll
            dataLength={localData?.length || 0}
            next={fetchMoreData}
            hasMore={currentPage < totalPages}
            className="px-4"
            loader={
              <div className="flex justify-center py-4 overflow-hidden ">
                <FadeLoader color="#000" height={5} width={5} />
              </div>
            }
          >
            <div className="my-10 grid grid-cols-4 lg:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-4 ">
              {localData?.length !== 0 ? (
                localData.map((product) => (
                  <MainExperienceList key={product._id} product={product} />
                ))
              ) : (
                <h1 className="font-medium text-sm">No Data Found</h1>
              )}
            </div>
          </InfiniteScroll>
        </div>
      </div>
      <MultipleAddressModal
        multipleAddressModalState={multipleAddressModalState}
        setMultipleAddressModalState={setMultipleAddressModalState}
      />
      <InstantLiveRequestModal
        instanreq={instant}
        role={"user"}
        instantLiveModalState={instantLiveModalState}
        setInstantLiveModalState={setInstantLiveModalState}
      />
      <MeetingNotification
        show={showNotification}
        onClose={handleCancel}
        onJoin={handleJoin}
        data={item}
      />
    </>
  );
};

export default MainHomePage;
