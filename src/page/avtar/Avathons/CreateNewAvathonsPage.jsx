import MyAvathonsCard from "@/components/Avatar/Card/CreateAvathonsCards/MyAvathonsCard";
import MyExperienceCard from "@/components/Avatar/Card/ExperiencePageCards/MyExperienceCard";
import TitleHeading from "@/components/Avatar/Heading/TitleHeading";
import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import Images from "@/constant/Images";
import { setExperinceList } from "@/store/slice/avtar/ExperienceFiltter";
import { getAvailableApi, getExpApi } from "@/utills/service/avtarService/AddExperienceService";
import { getAvathonsApi } from "@/utills/service/avtarService/CreateAvathonsService";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

function CreateNewAvathonsPage() {
  const [messageShown, setMessageShown] = useState(false);
  const toastShownRef  = useRef(false)


  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [avathonsData, setAvathonsData] = useState([]);



  const getAvathons = async () => {
    setLoader(true);
    try {
      const response = await getAvathonsApi();

      if (response?.isSuccess) {
        setAvathonsData(response.data);
        // dispatch(setExperinceList(response.data));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    getAvathons();
  }, []);



 
  return (
    <>
      {loader && <Loader />}
      <div className="px-4">
        <HeaderBack link="/avatar/dashboard" text={"Avathons"} />

        <Link to="/avatar/add-avathons-image" className="text-center p-8 border-dashed border-2 border-grey-800 my-5 rounded-md block sm:p-4" style={{ boxShadow: "0 0 17px rgba(0,0,0,0.08)" }}>
          <div className="flex justify-center ">
            <div className="p-4 bg-[#F2F2F2] rounded-md">
              <img src={Images.add} alt="add" />
            </div>
          </div>
          <p className="text-grey-800 py-2 pt-7 sm:pt-2 sm:pb-0">Create New</p>
          <h1 className="text-grey-900 text-xl">Avathons</h1>
        </Link>

        <TitleHeading title={"My Avathons"} />

        <div className="grid grid-cols-4 2xl:grid-cols-3 lg:grid-cols-2 sm:grid-cols-1 xl:grid-cols-3 gap-4 my-2">
          {avathonsData?.map((item) => (
            <MyAvathonsCard key={item?._id} item={item} onDelete={getAvathons} />
          ))}

          {avathonsData?.length === 0 && <h1 className="text-sm font-medium">No Avathons Found</h1>}
        </div>
      </div>
    </>
  );
}

export default CreateNewAvathonsPage;
