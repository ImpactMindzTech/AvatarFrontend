import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BookedCard from "@/components/Avatar/Card/ExperiencePageCards/BookedCard";
import CancelCard from "@/components/Avatar/Card/ExperiencePageCards/CancelCard";
import CompletedCard from "@/components/Avatar/Card/ExperiencePageCards/CompletedCard";
import OffersCard from "@/components/Avatar/Card/OffersCard";
import RequestedCard from "@/components/Avatar/Card/RequestCard";
import Loader from "@/components/Loader";
import { getRequestsApi } from "@/utills/service/avtarService/AddExperienceService";
import AvathonCard from "@/components/Avatar/Card/AvathonCard";

const ExperiencePage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const tabs = ["Offers","Avathons", "Requested", "Booked", "Completed", "Cancelled"];

  const [activeTab, setActiveTab] = useState("Requested");
  const [loading, setLoading] = useState(false);
  const [experienceStatus, setExperienceStatus] = useState(null);
  const[showCameraNotice,setShowCameraNotice] = useState(true);

 
  const getRequests = async (tab) => {
    setLoading(true);
    try {
      const response = await getRequestsApi(tab);

      if (response?.isSuccess) {
        setExperienceStatus(response); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };


  const handleTabClick = (tab) => {
    setActiveTab(tab); 
    navigate(`/avatar/experience?tab=${tab.toLowerCase()}`);
  };

  
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search); 
    const tabFromUrl = searchParams.get("tab") || "requested"; 
    const capitalizedTab = tabFromUrl.charAt(0).toUpperCase() + tabFromUrl.slice(1);

    if (tabs.includes(capitalizedTab)) {
      setActiveTab(capitalizedTab); 
      getRequests(capitalizedTab); 
    } else {
      navigate("/avatar/experience?tab=requested");
    }
  }, [location.search, activeTab]); 

  return (
    <>
      {loading && <Loader />} 
      <div className="">
        <div className="p-4 ">
          {/* Tab Navigation */}
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
                  onClick={() => handleTabClick(tab)} // Update the active tab on click
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          {activeTab === "Booked" && showCameraNotice && (
            <div className="bg-blue-100 p-4 rounded-md text-black text-sm flex justify-between items-center mb-2 mt-2">
            <p>
            Please allow camera access to enjoy the live tour experience
            </p>
            <button onClick={() => setShowCameraNotice(false)} className="text-xl font-bold text-gray-800">
              &times;
            </button>
          </div>
          )}

        
      
          {/* Content Section */}
          <div className="my-5 grid grid-cols-3 md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4">
            {/* Render cards based on the experience data */}
     
            {experienceStatus?.data?.length > 0 ? (
              experienceStatus?.data?.map((item) => {
                const key = item?.expid || item?.id || Math.random(); // Generate a unique key
             
                if(item?.type==="Offers"){
                  return <OffersCard key={key} item={item} />;
                }
                 if(item?.type==="Avathons"){
                  return <AvathonCard key={key} item={item} experienceStatus={experienceStatus} setExperienceStatus={setExperienceStatus}/>;
                 }
                switch (item?.status) {
                  case "Requested":
                    return <RequestedCard key={key} item={item}  role="avatar" />;
                  case "Booked":
                    return <BookedCard key={key} item={item} role="avatar" />;
                  case "Completed":
                    return <CompletedCard key={key} item={item} role="avatar" />;
                  case "Cancelled":
                    return <CancelCard key={key} item={item} role="avatar" />;
                 
                  default:
                    return null;
                }
                
                
               
              })
            ) : (
              <h1 className="font-medium text-sm">No data found</h1> // Handle empty data case
            )}
            
          </div>
        </div>
      </div>
    </>
  );
};

export default ExperiencePage;
