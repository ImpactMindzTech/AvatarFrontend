import Loader from "@/components/Loader";
import DeleteAvathonsModal from "@/components/Modal/DeleteAvathonsModal";
import DeleteExperienceModal from "@/components/Modal/DeleteExperienceModal";
import Images from "@/constant/Images";
import { setExperinceList } from "@/store/slice/avtar/ExperienceFiltter";
import { deleteAvathonsApi } from "@/utills/service/avtarService/CreateAvathonsService";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

function MyAvathonsCard({ item, onDelete }) {
    console.log(item,"item")
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEditAvathons = (item) => {
    navigate("/avatar/edit-avathons/" + item?._id, { state: item });
  };

  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setDeleteModalState(true);
  };

  const handleDeleteAvathons = async () => {
    if (itemToDelete) {
      setLoader(true);
      try {
        const response = await deleteAvathonsApi(itemToDelete?._id);
        if (response?.isSuccess) {
            console.log(response,"Resss")
          toast.success("Avathons success deleted");
          onDelete();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    }
  };
  return (
    <>
      {loader && <Loader />}

      <div className="card">
        <div className="w-full relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <div onClick={() => handleEditAvathons(item)} className="bg-white p-2 rounded-md BoxShadowLessRounded sm:p-1 cursor-pointer">
              <img src={Images.edit} alt="edit" className="w-6 h-6 sm:w-4 sm:h-4" />
            </div>
        
          </div>
          <img src={item?.avathonsThumbnail} alt="banner" className="w-[100%] aspect-[1.4] object-cover rounded-2xl" />
        </div>
        <h1 className="text-grey-900 my-2 leading-6 xl:text-lg md:text-sm md:mb-1">
          {item?.avathonTitle}, {item?.Country}
        </h1>
        <h3 className="text-grey-900 font-medium xl:text-sm md:text-xs">
          {item?.City && item?.City + ","} {item?.Country}
        </h3>
      </div>

    
    </>
  );
}

export default MyAvathonsCard;
