import Loader from "@/components/Loader";
import DeleteExperienceModal from "@/components/Modal/DeleteExperienceModal";
import Images from "@/constant/Images";
import { setExperinceList } from "@/store/slice/avtar/ExperienceFiltter";
import { deleteExperienceApi } from "@/utills/service/avtarService/AddExperienceService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";


function MyExperienceCard({ item, onDelete ,setExpData}) {
   let imageurl = localStorage.getItem('image');
   const [thumbnail, setThumbnail] = useState(imageurl || item?.thumbnail);
  const [loader, setLoader] = useState(false);

  const navigate = useNavigate();
  const [deleteModalState, setDeleteModalState] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleEditExperince = (item) => {
    navigate("/avatar/edit-experience/" + item?._id, { state: item });
  };

  const handleOpenModal = (item) => {
    setItemToDelete(item);
    setDeleteModalState(true);
  };

  const handleDeleteExperince = async () => {
    if (itemToDelete) {
      setLoader(true);
      try {
        const response = await deleteExperienceApi(itemToDelete?._id, {
          status: 1,
        });
        if (response?.isSuccess) {
          toast.success("Experience success deleted");
          onDelete();
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoader(false);
      }
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setThumbnail(item?.thumbnail);
    
    }, 5000);
  
    // Cleanup function to clear the timeout if the component unmounts
    return () => clearTimeout(timeout);
  }, [item?.thumbnail]);

  return (
    <>
      {loader && <Loader />}

      <div className="card">
        <div className="w-full relative">
          <div className="absolute top-2 right-2 flex gap-2">
            <div onClick={() => handleEditExperince(item)} className="bg-white p-2 rounded-md BoxShadowLessRounded sm:p-1 cursor-pointer">
              <img src={Images.edit} alt="edit" className="w-6 h-6 sm:w-4 sm:h-4" />
            </div>
            <div onClick={() => handleOpenModal(item)} className="bg-white p-2 rounded-md BoxShadowLessRounded sm:p-1 cursor-pointer">
              <img src={Images.redtrash} alt="redtrash" className="w-6 h-6 sm:w-4 sm:h-4" />
            </div>
          </div>
          <img src={ thumbnail } alt="banner" className="w-[100%] aspect-[1.4] object-cover rounded-2xl"  loading="lazy" />
        </div>
        <h1 className="text-grey-900 my-2 leading-6 xl:text-lg md:text-sm md:mb-1">
          {item?.ExperienceName}, {item?.country}
        </h1>
        <h3 className="text-grey-900 font-medium xl:text-sm md:text-xs">
          {item?.city && item?.city + ","} {item?.country}
        </h3>
      </div>

      <DeleteExperienceModal data={item} deleteModalState={deleteModalState} setDeleteModalState={setDeleteModalState} onConfirm={handleDeleteExperince} />
    </>
  );
}

export default MyExperienceCard;
