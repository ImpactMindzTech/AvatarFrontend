import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom"; // Import useLocation and useNavigate
import ExperiencePageHeader from "@/components/UserHeader/ExperiencePageHeader";
import RequestedCard from "@/components/Avatar/Card/RequestCard";
import BookedCard from "@/components/Cards/ExperiencePageCard/BookedCard";
import CancelledCard from "@/components/Cards/ExperiencePageCard/CancelledCard";
import CompletedCard from "@/components/Cards/ExperiencePageCard/CompletedCard";
import { setExperinceStatus } from "@/store/slice/experinceS/ExperinceSlice";
import { experienceGetUserApi } from "@/utills/service/experienceService/ExperienceService";
import Loader from "@/components/Loader";
import { Link } from "react-router-dom";
import Images from "@/constant/Images";
import RecordItModal from "@/components/Modal/RecordItModal";
import OffersCard from "@/components/Avatar/Card/OffersCard";
import UseroffersCard from "@/components/Avatar/Card/UserOfferCard";
import AvathonJoinCard from "@/components/Avatar/Card/AvathonJoinCard";

function Experience() {
  const dispatch = useDispatch();
  const experinceStatusDetails = useSelector(
    (state) => state?.ExperinceProduct?.experinceStatus
  );

  const [InstantLiveModal, setInstantLiveModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const tabs = ["Avathons","Requested", "Booked", "Completed", "Cancelled", "Offers"];
  const [activeTab, setActiveTab] = useState("");
  const [showCameraNotice, setShowCameraNotice] = useState(true);
  const [loader, setLoader] = useState(false);

  const experienceGetrequests = async (status) => {
    try {
      setLoader(true);
      const response = await experienceGetUserApi(status);
      dispatch(setExperinceStatus(response));
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get("tab");
    const capitalizedTab = tab
      ? tab.charAt(0).toUpperCase() + tab.slice(1)
      : "Avathons";

    if (tabs.includes(capitalizedTab)) {
      setActiveTab(capitalizedTab);
      experienceGetrequests(capitalizedTab);
    } else {
      navigate("/user/experience?tab=booked");
    }
  }, [location.search]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    navigate(`/user/experience?tab=${tab.toLowerCase()}`);
  };

  const renderCard = (item) => {
    if (item?.Type === "Offers") {
     

      return <UseroffersCard key={item._id} item={item} />;
    }
    if (item?.avathonId?.type === "Avathons") {
    

      return <AvathonJoinCard key={item._id} item={item} />;
    }
    switch (item.status) {
      case "Requested":
        return <RequestedCard key={item.reqId} item={item} />;
      case "Booked":
        return <BookedCard key={item.reqId} item={item} />;
      case "Completed":
        return <CompletedCard key={item.reqId} item={item} />;
      case "Cancelled":
        return <CancelledCard key={item.reqId} item={item} />;
      default:
        return null;
    }
  };

  return (
    <>
      {loader && <Loader />}
      <div className="container">
        {/* <ExperiencePageHeader /> */}
        <div className="my-3">
          <div className="p-4 sm:px-0">
            <div className="flex justify-end">
   
            </div>
            <div className="lg:overflow-x-auto lg:overflow-y-hidden border-b">
              <div className="flex border-b">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 text-sm font-medium border-b-2 ${
                      activeTab === tab
                        ? "border-primaryColor-900 text-primaryColor-900 font-bold"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => handleTabClick(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Display the relevant cards based on the selected tab */}
            {activeTab.toLocaleLowerCase() === "requested" && (
              <p className="bg-[#fff0f0] py-[10px] px-[15px] text-[#ff5454] mt-5 rounded-sm">
                This section shows all the tours you've requested to book.
              </p>
            )}
            {activeTab.toLocaleLowerCase() === "booked" && (
         <>
         
         
              {showCameraNotice&&(
                <>
  <div className="bg-blue-100 p-4 rounded-md text-black text-sm flex justify-between items-center mb-2 mt-2">
                  <p>
                  Please allow camera access to enjoy the live tour experience
                  </p>
                  <button onClick={() => setShowCameraNotice(false)} className="text-xl font-bold text-gray-800">
                    &times;
                  </button>
                </div>
                </>
              )}
          
              <p className="bg-[#fff0f0] py-[10px] px-[15px] text-[#ff5454] mt-5 rounded-sm">
                Here you'll find tours that have moved from requested to
                confirmed and officially booked.
              </p>
         </>
            )}
            {activeTab.toLocaleLowerCase() === "completed" && (
              <p className="bg-[#fff0f0] py-[10px] px-[15px] text-[#ff5454] mt-5 rounded-sm">
                This is where all your completed tours will be displayed.
              </p>
            )}
            {activeTab.toLocaleLowerCase() === "cancelled" && (
              <p className="bg-[#fff0f0] py-[10px] px-[15px] text-[#ff5454] mt-5 rounded-sm">
                This section lists all tours that have been cancelled.
              </p>
            )}
            {activeTab.toLocaleLowerCase() === "offers" && (
              <p className="bg-[#fff0f0] py-[10px] px-[15px] text-[#ff5454] mt-5 rounded-sm">
                Here you'll find the tours you've created on the offer page,
                along with their current status.
              </p>
            )}
             {activeTab.toLocaleLowerCase() === "avathons" && (
              <p className="bg-[#fff0f0] py-[10px] px-[15px] text-[#ff5454] mt-5 rounded-sm">
                Here you'll find avathons that have moved from requested to
                confirmed and officially booked.
              </p>
            )}
            <div className="my-5 grid grid-cols-3 2xl:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {experinceStatusDetails?.isSuccess &&
              experinceStatusDetails?.data?.length > 0 ? (
                experinceStatusDetails.data.map((item) => renderCard(item))
              ) : (
                <h1 className="font-medium text-sm">No data found</h1>
              )}
            </div>
          </div>
        </div>
      </div>
      <RecordItModal
        InstantLiveModal={InstantLiveModal}
        setInstantLiveModal={setInstantLiveModal}
      />
    </>
  );
}

export default Experience;
