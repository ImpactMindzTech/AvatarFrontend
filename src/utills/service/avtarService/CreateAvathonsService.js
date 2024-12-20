import axiosInstance from "@/utills/AxiosInstance";
import toast from "react-hot-toast";

export const CreateAvathonsApi = async (payload) => {
  console.log(payload,"payload")
  try {
    const res = await axiosInstance.post("/avatar/createavathons", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const getAvathonsApi = async () => {
    try {
      const res = await axiosInstance.get("/avatar/myavathons");
      return res.data;
    } catch (error) {
      // toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

export const deleteAvathonsApi = async (id, payload) => {
    try {
      const res = await axiosInstance.patch("/avatar/deeleteAvathons/" + id, payload);
      return res.data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.log(error);
    }
  };

export const editAvathonsApi=async(id,payload)=>{
  


    try {
        const res = await axiosInstance.patch(`/avatar/editavathons/${id}`,payload);
        return res.data;
    } catch (error) {
        toast.error(error?.response?.data?.message);
        console.log(error);
    }
}

//   .patch("/editavathons/:id