import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";


import {
  Addpaypal,
  fetchpaypalApi,

} from "@/utills/service/avtarService/Earnings";

// Form validation schema
const stripeAccountSchema = yup.object().shape({
  email: yup.string().email("Invalid email.").required("Email is required."),
  name:yup.string().required("Name is required"),

});

function PaypalAccountPage() {
  const [loader, setLoader] = useState(false);

  const[isdata,setdata] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    
  } = useForm({
    resolver: yupResolver(stripeAccountSchema),
    defaultValues: { email: "" }, // Include countryCode in default values
  });

  const onSubmit = async (data) => {
    setLoader(true);

    try {

      const res = await Addpaypal(data);
    
    
      if (res?.isSuccess) {
        toast.success(res.message || "Account added/updated successfully.");
        if (res.onboardingLink) {
          window.open(res.onboardingLink, "_blank", "noopener,noreferrer");
        }
      } else {
        toast.error(res?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting data:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchStripeData = async () => {
      setLoader(true);
      try {
        const res = await fetchpaypalApi();

        if (res?.isSuccess) {
          setdata(true);
          reset({
            email: res?.data?.paypalEmail

            || "",
            name: res?.data?.paypalName
            || "",
           
          });
       
        }
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchStripeData();
  }, [reset]);


  return (
    <>
      {loader && <Loader />}
      <div className="container">
  <HeaderBack link="/avatar/bank" text="Paypal Account" />
  <div className="mt-5">
    <form onSubmit={handleSubmit(onSubmit)}>
  
    
     

      <label className="block mt-4 mb-2" htmlFor="name">
        Name
      </label>
      <input
        type="text"
        id="name"
        className="input"
        placeholder="Eg. Jhone Doe"
        {...register("name")}
      />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      <label className="block mt-4 mb-2" htmlFor="email">
        Email
      </label>
      <input
        type="email"
        id="email"
        className="input"
        placeholder="Eg. example@gmail.com"
        {...register("email")}
      />
      {errors.email && <p className="text-red-500">{errors.email.message}</p>}

      <div className="mt-5">
        <button
          type="submit"
          className="font-bold w-full p-3 bg-backgroundFill-900 rounded-md text-white"
        >
          {isdata ? "Update Account" : "Add Account"}
        </button>
      </div>
    </form>
  </div>
</div>

    </>
  );
}

export default PaypalAccountPage;
