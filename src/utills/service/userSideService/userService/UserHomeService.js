import axiosInstance from "@/utills/AxiosInstance";
import toast from "react-hot-toast";

export const userExperienceApi = async (payload) => {
  // console.log("payload", payload);
  const { tab, country="United States", search, items_per_page, page } = payload;
  try {
    const res = await axiosInstance.get(`/user/getExperience?filters=${tab}&country=${country}&search=${search}&items_per_page=${items_per_page}&pg=${page}`);
    // console.log(res.data,"ress")
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const userExperiencesApi = async (payload) => {
  // console.log("payload", payload);
  const { tab, country="United States", search, items_per_page, page } = payload;
  try {
    const res = await axiosInstance.get(`/user/getExperiences?filters=${tab}&country=${country}&search=${search}&items_per_page=${items_per_page}&pg=${page}`);
    // console.log(res.data,"ress")
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const getmeetdata = async(id)=>{

  try{
   const res = await axiosInstance.get("user/meetdata/" + id);
   
   return res.data;
  }catch(err){
   console.log(err);
 
  }
 }

export const userExperienceListApi = async (id) => {
  try {
    const res = await axiosInstance.get("/user/getdetailExp/" + id);
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const useravathonApi = async (id) => {
  try {
    const res = await axiosInstance.get("/user/getavathondetail/" + id);

    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};


export const mainExperienceListApi = async (id) => {
  try {
    const res = await axiosInstance.get("/user/getdetailExps/" + id);
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const getAllcountryApi = async () => {
  try {
    const res = await axiosInstance.get("/user/getAllcountry/");
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const bookingExperinceApi = async (id, payload) => {
  try {
    const res = await axiosInstance.post("/user/booking/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const getBookingDetailsApi = async (id) => {
  try {
    const res = await axiosInstance.get("/user/getBookingDetails/" + id);
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const updateBookingTimeApi = async (id, payload) => {
  try {
    const res = await axiosInstance.patch("/user/updateBookingTime/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const updateBookingDateApi = async (id, payload) => {
  try {
    const res = await axiosInstance.patch("/user/updateBookingDate/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const userfilteredExp = async (payload) => {
  const { tab, search,items_per_page,page } = payload;


  try {
    const res = await axiosInstance.get(`/user/getExpcategorywise?${tab}=${search}&items_per_page=${items_per_page}&pg=${page}`);
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const getAvatardetail = async (data) => {
  const{id,pg,items_per_page} = data;
  console.log(data);
  try {
    let res = await axiosInstance(`/avatar/avatardetail/${id}?pg=${pg}&items_per_page=${items_per_page}` );
    return res.data;
  } catch (err) {
    console.log(err);
    toast.error(err?.response?.data?.message);
  }
};

export const bookingSlotsApi = async (id, payload) => {
  try {
    const queryParams = new URLSearchParams(payload).toString();
    const res = await axiosInstance.get(`/user/bookingslots/${id}?${queryParams}`);
    return res.data;
  } catch (error) {
    // toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const reportBookingApi = async (id, payload) => {
  try {
    const res = await axiosInstance.post("/user/report/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const reportAvatarApi = async (id, payload) => {
  try {
    const res = await axiosInstance.post("/user/avatarReport/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};

export const deleteAccountApi = async (status) => {
  try {
    const res = await axiosInstance.patch(`/user/deleteAcc/${status}`, null);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const freezeAccountApi = async (status) => {
  try {
    const res = await axiosInstance.patch(`/user/freezeAcc/${status}`, null);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const rateTourApi = async (id, payload) => {
  try {
    const res = await axiosInstance.post("user/giveRating/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};
export const avtrateTourApi = async (id, payload) => {
  try {
    const res = await axiosInstance.post("user/giverate/" + id, payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
    console.log(error);
  }
};


export const payaddon = async(payload)=>{

  try{
     const res = await axiosInstance.post("user/payaddon",payload);
     return res.data;

  }catch(err){
    toast.error(err?.response?.data.message)
  }
}
export const checkout = async (payload) => {
  try {
    const res = await axiosInstance.post("avatar/checkout", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
};
export const avathoncheckout = async (payload) => {
  try {
    const res = await axiosInstance.post("user/avathoncheckout", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
};
export const avathonpaypalcheckout = async (payload) => {
  try {
    const res = await axiosInstance.post("user/avathonpaypal", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
};
export const offerdelete = async (id) => {

  try {
    const res = await axiosInstance.patch(`user/deleteoffer/${id}`,);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
};







export const offercheckout = async (payload) => {
  try {
    const res = await axiosInstance.post("user/offercheckout", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
};
export const paymentstripeApi = async (payload) => {
  try {
    const res = await axiosInstance.post("user/paymentstripe", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.message);
  }
};

export const paypalcheckout = async (payload) => {
  try {
    const res = await axiosInstance.post("avatar/payCheckout", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.messsage);
  }
};
export const offerPaypalcheckout = async (payload) => {
  try {
    const res = await axiosInstance.post("user/offerPaypalcheckout", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.messsage);
  }
};
export const paymentPaypalApi = async (payload) => {
  try {
    const res = await axiosInstance.post("user/paymentPaypal", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data.messsage);
  }
};

export const getAvailableApi = async () => {
  try {
    const res = await axiosInstance.get("avatar/getAvailable");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export const sendTipStripeApi = async (payload) => {
  try {
    const res = await axiosInstance.post("user/tipsendstripe", payload);
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};

export const sendTipPaypalApi = async (payload) => {
  try {
    const res = await axiosInstance.post("user/tipsendpaypal", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);

    console.log(error);
  }
};

export const claimRefundApi = async (payload) => {
  try {
    const res = await axiosInstance.post("user/refunduser", payload);
    return res.data;
  } catch (error) {
    console.log(error?.response?.data?.message);
    toast.error(error?.response?.data?.message);
  }
};
export const avatarCancelledApi = async (payload) => {
  try {
    const res = await axiosInstance.post("avatar/refunds", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};

export const notificationApi = async (payload) => {
  try {
    const res = await axiosInstance.post("user/Notifications", payload);
    return res.data;
  } catch (error) {
    toast.error(error?.response?.data?.message);
  }
};
export const getNotificationApi = async () => {
  try {
    const res = await axiosInstance.get("user/getNotification");
    return res.data;
  } catch (error) {
    console.log(error);
    toast.error(error?.response?.data?.message);
  }
};


export const getOfferDetails = async (id) => {
  try {
    const res = await axiosInstance.get("/avatar/offerdetails/" + id);
    return res.data;

  } catch (err) {
    console.log(err);
  }
}


export const completeoffer = async (id) => {
  try {
    const res = await axiosInstance.post("/user/completeoffer/" + id);
    return res.data;
  } catch (err) {
    console.log(err);
  }

}

export const reportbug = async(payload)=>{
  try{
  const res = await axiosInstance.post("/user/reportbug",payload);


  return res.data;
  }catch(err){
    console.log(err);
  }
}
export const Joinavathon = async(id)=>{
  try{
  const res = await axiosInstance.post("/user/bookavathon/"+id);
  return res.data;

  }catch(err){
    console.log(err);
  }
}
export const notifi = async(payload)=>{

  try{
  const res = await axiosInstance.post("/user/notification",payload);
  return res.data;

  }catch(err){
    console.log(err);
  }
}

