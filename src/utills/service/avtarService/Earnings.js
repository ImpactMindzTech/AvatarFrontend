import axiosInstance from "@/utills/AxiosInstance";
import toast from "react-hot-toast";

export const avatarEarningApi = async () => {
  try {
    const res = await axiosInstance.get("/avatar/avatarEarning");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const AddstripeApi = async (payload) => {
  try {
    const res = await axiosInstance.post("/avatar/addstripe", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const Addpaypal = async (payload) => {
  try {
    const res = await axiosInstance.post("/avatar/addpaypal", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const fetchstripeApi = async () => {
  try {
    const res = await axiosInstance.get("/avatar/allstripedetails");
    return res.data;

  } catch (error) {
    console.log(error)
    // toast.error(res.data.message);
  }
};


export const fetchPaypalApi = async()=>{
  try{
    const res = await axiosInstance.get("/avatar/allpaypaldetails");
    return res.data;


  }catch(err){
    console.log(err)
  }
}
export const fetchpaypalApi = async () => {
  try {
    const res = await axiosInstance.get("/avatar/getpaypal");
    return res.data;

  } catch (error) {
    console.log(error)
    // toast.error(res.data.message);
  }
};

export const withdrawAmountApi = async (payload) => {
  try {
    const res = await axiosInstance.post("/avatar/withdraw", payload);
 
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
  }
};
export const withdrawpaypal = async (payload) => {
  try {
    const res = await axiosInstance.post("/avatar/withdrawpaypal", payload);
 
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.error);
  }
};
