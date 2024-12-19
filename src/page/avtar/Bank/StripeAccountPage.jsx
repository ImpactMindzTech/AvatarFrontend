import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";

import AvatarBottomBtn from "@/components/Avatar/Button/AvatarBottomBtn";
import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import Dropdown from "@/components/statecitycountry/DropDown";

import {
  AddstripeApi,
  fetchstripeApi,
} from "@/utills/service/avtarService/Earnings";

// Form validation schema
const stripeAccountSchema = yup.object().shape({
  email: yup.string().email("Invalid email.").required("Email is required."),
  country: yup.string().required("Country is required."),
  countryCode: yup.string().required("Country code is required."), // Add country code validation
});

function StripeAccountPage() {
  const [loader, setLoader] = useState(false);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const[isdata,setdata] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue, // Use setValue to dynamically set form values
  } = useForm({
    resolver: yupResolver(stripeAccountSchema),
    defaultValues: { email: "", country: "", countryCode: "" }, // Include countryCode in default values
  });

  const onSubmit = async (data) => {
    setLoader(true);
    try {
      const res = await AddstripeApi(data);
      if (res?.isSuccess) {
        toast.success(res.message || "Account added/updated successfully.");
        if (res.url) {
          window.open(res.url, "_blank", "noopener,noreferrer");
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
        const res = await fetchstripeApi();
        
        if (res?.isSuccess) {
          setdata(true);
          reset({
            email: res?.data?.stripeEmail || "",
            country: res?.data?.country || "",
            countryCode: res?.data?.countryCode || "", // Set countryCode
          });
          setSelectedCountry(
            countries.find((c) => c.name === res?.data?.country) || null
          );
        }
      } catch (error) {
        console.error("Error fetching Stripe data:", error);
      } finally {
        setLoader(false);
      }
    };

    fetchStripeData();
  }, [reset, countries]);

  useEffect(() => {
    fetch("/Stripe.json")
      .then((response) => response.json())
      .then((data) => {
        setCountries(data.map((c) => ({ name: c.name, code: c.isoCode })));
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);
  return (
    <>
      {loader && <Loader />}
      <div className="container">
  <HeaderBack link="/avatar/bank" text="Stripe Account" />
  <div className="mt-5">
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="block mb-2" htmlFor="country">
        Select Country
      </label>
      <div className="flex items-center gap-2 mb-2">
      <div
          className="relative group "
          aria-label="Tooltip with additional info"
        >
          <span className="inline-flex items-center justify-center w-5 h-5 text-white bg-gray-500 rounded-full text-xs">
            i
          </span>
        
        </div>
        <p className="text-gray-500 text-sm">
        Only these countries support Stripe accounts.
        </p>
       
      </div>
      <Dropdown
        data={countries.map((c) => c.name)}
        selectedValue={selectedCountry?.name || ""}
        onChange={(name) => {
          const country = countries.find((c) => c.name === name);
          setSelectedCountry(country || null);
          setValue("country", name); // Set the country name
          setValue("countryCode", country?.code || ""); // Set the country code
        }}
        placeholder="Select Country"
      />
      {errors.country && <p className="text-red-500">{errors.country.message}</p>}
      {errors.countryCode && (
        <p className="text-red-500">{errors.countryCode.message}</p>
      )}

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

export default StripeAccountPage;
