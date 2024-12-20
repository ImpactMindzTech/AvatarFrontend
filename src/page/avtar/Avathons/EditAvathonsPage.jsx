import EditExperienceCard from "@/components/Avatar/Card/EditExperienceCard";
import TitleHeading from "@/components/Avatar/Heading/TitleHeading";
import HeaderBack from "@/components/HeaderBack";
import TimezoneSelect from "react-timezone-select";
import Images from "@/constant/Images";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { formatTimeToHHMM } from "@/constant/date-time-format/DateTimeFormat";
import {
  CitySelect,
  CountrySelect,
  StateSelect,
} from "react-country-state-city";
import { addExperinceValidation, editAvathonsValidation } from "@/utills/formvalidation/FormValidation";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import Loader from "@/components/Loader";
import { editAvathonsApi } from "@/utills/service/avtarService/CreateAvathonsService";

function EditAvathonsPage() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const [removedImages, setRemovedImages] = useState([]);
  const params = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedDate, setSelectedDate] = useState();
  const [countryid, setCountryid] = useState({
    id: undefined,
    name: undefined,
  });
  const [selectedTime, setSelectedTime] = useState();

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };
  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  const [stateid, setstateid] = useState({ id: undefined, name: undefined });
  const [cityId, setCityId] = useState({ id: undefined, name: undefined });
  const [newFiles, setNewFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [otherSelectedFiles, setOtherSelectedFiles] = useState([]);
  const [otherImageURLs, setOtherImageURLs] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const mainImage = useRef(null);
  const otherImage = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(editAvathonsValidation) });
  const state = location?.state;
console.log(state);

  const handleRemoveMainImage = () => {
    setImageURL(null);
    setSelectedFile("");
  };
  const handleCountryChange = (e) => {
    if (e) {
      setCountryid(e);
      setstateid({ id: 0, name: "select new state" });
      setCityId({ id: undefined, name: "select new city" });
    }
  };
  const handleMainImageClick = () => {
    if (mainImage.current) {
      mainImage.current.click();
    }
  };

  const handleOtherImageClick = () => {
    if (otherImage.current) {
      otherImage.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith("video/")) {
        setSelectedFile(file);
        setImageURL(URL.createObjectURL(file));
      } else {
        toast.error("Please upload a valid video file.");
      }
    }
  };

  const handleOtherFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("image/")
      );
      if (files.length !== e.target.files.length) {
        toast.error("Some files were not images and were not added.");
      }

      // Generate full URLs and store them in state
      const newImageURLs = files.map((file) => URL.createObjectURL(file));
      setNewFiles((prevFiles) => [...prevFiles, ...files]);
      setOtherSelectedFiles((prevFiles) => [...prevFiles, ...files]);
      setOtherImageURLs((prevURLs) => [...prevURLs, ...newImageURLs]);
    }
  };

  useEffect(() => {
    setLoader(true);
    if (state) {
      if (state?.Eighteenplus) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }

      setOtherImageURLs(state.avathonsImage);
      if (state && state.avathonsImage) {
        const imageURLs = state.avathonsImage.map((image, index) => {
          return { name: `Image ${index + 1}`, url: image }; // Adjust according to your structure
        });

        // Extract unique images
        const uniqueImages = imageURLs.reduce((acc, image) => {
          if (!acc.some((img) => img.url === image.url)) {
            acc.push({
              name: image.url.split("/").pop(),
              url: image.url,
            });
          }
          return acc;
        }, []);
        setOtherSelectedFiles(uniqueImages);
      }
    let time = formatTimeToHHMM(state?.avathonTime);
    console.log(time);
      setValue("AvathonName", state?.
        avathonTitle);
      setValue("RegularPrice", state?.RegularPrice);
      setValue("EarlybirdPrice", state?.EarlybirdPrice);
      setValue("avathonDescription", state?.avathonDescription);
      setValue("aboutStream", state?.aboutStream);
      setValue("Availablespots",state?.Availablespots)
      setValue("RegularPrice",state?.avathonPrice)
      setValue("avathonDate",state?.avathonDate)
      setValue("Time",time);
      setValue("Eighteenplus",state?.Eighteenplus)
      setImageURL(state?.avathonsThumbnail);
      setCountryid({ id: state.Country, name: state.Country });
      setstateid({ id: state.State, name: state.State });
      setCityId({ id: state.suburb, name: state.City });

      let avathonDate = "";
      if (state?.avathonDate) {
        
        const date = new Date(state?.avathonDate);
   
        if (!isNaN(date.getTime())) {
          const day = ("0" + date.getDate()).slice(-2);  // Add leading zero if day < 10
          const month = ("0" + (date.getMonth() + 1)).slice(-2);  // Add leading zero if month < 10
          const year = date.getFullYear();
          
          // Store the date in dd/mm/yyyy format
          avathonDate = `${year}-${month}-${day}`;  // Format to yyyy-mm-dd
        }
      }
     
      setSelectedDate(avathonDate);  // Set the selectedDate as yyyy-mm-dd format
      setSelectedTime(time);  // Set the selected time
    }
    setLoader(false);
  }, [state, setValue]);

  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();

    // Append form fields
    formData.append("AvathonName", data?.AvathonName);

 
    formData.append("country", countryid.name);

    formData.append("avathonDate", selectedDate || "");
    formData.append("Time", selectedTime || "");
    formData.append("EarlybirdPrice",data?.EarlybirdPrice);
    formData.append("RegularPrice", data?.RegularPrice);
    formData.append("avathonDescription",data?.avathonDescription);
    formData.append("aboutStream", data?.aboutStream);
    formData.append("Availablespots", data?.Availablespots);
    formData.append("Eighteenplus", isChecked);
    if (stateid?.name) {
      if (stateid.name == "select new state") {
        formData.append("State", "");
      } else {
        formData.append("State", stateid?.name);
      }
    } else {
      formData.append("State", "");
    }
    if (cityId?.name) {
      if (cityId.name == "select new city") {
        formData.append("city", "");
      } else {
        formData.append("city", cityId?.name);
      }
    } else {
      formData.append("city", "");
    }

    formData.append("bookinstaltly", isChecked);
    if (selectedFile == "") {
      toast.error("Please Select thumbnail");
      setLoader(false);
      return;
    }
    if (countryid.name == undefined) {
      toast.error("Please Select Country");
      setLoader(false);
      return;
    }
    if (selectedFile) {
      formData.append("video", selectedFile);
      formData.append("removeThumbnail", true);
    } else {
      formData.append("removeThumbnail", false);
    }

    for (let index = 0; index < newFiles.length; index++) {
      formData.append(`images`, newFiles[index]);
    }
    formData.append("removeImages", JSON.stringify(removedImages));
   
    try {
      const response = await editAvathonsApi(params?.id, formData);
      if (response?.isSuccess) {
        navigate("/avatar/create-avathons");
        toast.success(response?.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to submit the form. Please try again.");
    } finally {
      setLoader(false);
    }
  };

  const handleRemoveOtherImage = (index) => {
    setNewFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setOtherSelectedFiles((prevFiles) =>
      prevFiles.filter((_, i) => i !== index)
    );
    setOtherImageURLs((prevURLs) => prevURLs.filter((_, i) => i !== index));

    // Use the full URL when removing
    setRemovedImages((prev) => [...prev, otherImageURLs[index]]);
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };  
 


  return (
    <>
      {loader && <Loader />}
      <div className="px-4">
        <HeaderBack link="/avatar/add-experience" text={"Edit Experience"} />
        <TitleHeading title={"Experience Images"} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between my-4 flex-wrap">
            <div className="w-[49%] relative">
              <div className="absolute top-2 right-2 flex gap-2 z-50">
                {/* <div className="bg-white p-4 sm:p-2 rounded-md BoxShadowLessRounded">
                <img src={Images.rotate} alt="edit" className="cursor-pointer w-6 h-6" />
              </div> */}
                {selectedFile !== "" && (
                  <div className="cursor-pointer bg-white p-4 sm:p-2 rounded-md BoxShadowLessRounded">
                    <img
                      onClick={handleRemoveMainImage}
                      src={Images.close}
                      alt="remove"
                      className="cursor-pointer w-6 h-6 "
                    />
                  </div>
                )}
              </div>

              {!imageURL ? (
                <div
                  onClick={handleMainImageClick}
                  className="border rounded-lg w-full  h-[240px] sm:h-[140px] bg-[#f2f2f2] border-[#e2e2e2] flex justify-center items-center flex-col cursor-pointer group py-5"
                >
                  <input
                    className="hidden"
                    onChange={handleFileChange}
                    ref={mainImage}
                    type="file"
                    accept="video/*"
                  />
                  <div className="flex justify-center p-2 bg-white rounded-md">
                    <img
                      src={Images.add}
                      alt="add"
                      className="w-8 h-8 object-contain"
                    />
                  </div>
                  <h1 className="text-center text-grey-800 pt-2 font-semibold group-hover:text-grey-900 sm:text-base">
                    Main Image
                  </h1>
                </div>
              ) : (
                <video
                  src={imageURL}
                  controls
                  alt="Selected"
                  className="w-full object-cover rounded-2xl z-10 h-[240px] sm:h-[140px]"
                />
              )}
            </div>

            <div className="w-[49%] h-full relative">
              <div
                onClick={handleOtherImageClick}
                className="border h-[240px] sm:h-[140px] rounded-lg w-full bg-[#f2f2f2] border-[#e2e2e2] flex justify-center items-center flex-col group cursor-pointer py-5"
              >
                <input
                  className="hidden"
                  onChange={handleOtherFileChange}
                  ref={otherImage}
                  type="file"
                  accept="image/*"
                  multiple
                />
                <div className="flex justify-center p-2 bg-white rounded-md">
                  <img
                    src={Images.add}
                    alt="add"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h1 className="text-center text-grey-800 pt-2 font-semibold group-hover:text-grey-900 sm:text-base">
                  Other Images
                </h1>
              </div>
            </div>
          </div>

          <div className="my-6 grid grid-cols-6 2xl:grid-cols-5 sm:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {otherImageURLs.map((url, index) => (
              <EditExperienceCard
                key={index}
                imageURL={url}
                onRemove={() => handleRemoveOtherImage(index)}
              />
            ))}
          </div>

          <div className="forms sm:mt-4">
            <div className="my-2">
              <label htmlFor="AvathonName" className="font-semibold">
              Add Avathons Name
              </label>
              <input
               type="text"
               name="AvathonName"
               id="AvathonName"
               className="input my-2"
               placeholder="Eiffel Tower"
               {...register("AvathonName")}
              />
             <p className="text-[red]">{errors?.AvathonName?.message}</p>
            </div>

            <div className="flex flex-col gap-2 my-3">
              <div className="flex flex-col gap-y-1">
                <label htmlFor="country" className="text-primaryColor-900">
                  Country
                </label>
                <CountrySelect
                  defaultValue={countryid}
                  inputClassName="input_border"
                  onChange={handleCountryChange}
                  placeHolder="Select Country"
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <label htmlFor="state" className="text-primaryColor-900">
                  State
                </label>
                <StateSelect
                  defaultValue={stateid}
                  inputClassName="input_border"
                  countryid={countryid?.id}
                  onChange={(e) => {
                    if (e) {
                      setstateid(e);
                      setCityId({ id: undefined, name: "select new city" });
                    }
                  }}
                  placeHolder="Select State"
                />
              </div>

              <div className="flex flex-col gap-y-1">
                <label htmlFor="city" className="text-primaryColor-900">
                  City
                </label>
                <CitySelect
                  defaultValue={cityId}
                  inputClassName="input_border"
                  countryid={countryid?.id} // Use optional chaining
                  stateid={stateid?.id} // Use optional chaining
                  onChange={(e) => {
                    if (e) {
                      setCityId(e);
                    }
                  }}
                  placeHolder="Select City"
                />
              </div>
            </div>
            <div className="my-2 flex gap-2 items-center w-full ">
            <div className="w-[50%]">
              <label htmlFor="avathonDate" className="font-semibold">
                Selected Date
              </label>
              <input
                type="date"
                name="avathonDate"
                id="avathonDate"
                className="input my-2 "
                value={selectedDate}
                onChange={handleDateChange}
              />
              <p className="text-[red]">{errors?.avathonDate?.message}</p>
            </div>
            <div className="w-[50%]">
              <label htmlFor="SelectedTime" className="font-semibold">
                Selected Time
              </label>
              <input
                type="time"
                name="Time
"
                id="Time
"
                className="input my-2"
                value={selectedTime}
                onChange={handleTimeChange}
              />
              <p className="text-[red]">{errors?.Time
?.message}</p>
            </div>
          </div>
      <div className="my-2 flex gap-2 items-center">
            <div className="w-[50%]">
              <label
                htmlFor="EarlybirdPrice"
                className="font-semibold items-center flex  gap-1"
              >
                Early Bird Price{" "}
                <span>
                  <img src={Images.info} className="w-4" />
                </span>
              </label>
              <input
                type="text"
                name="EarlybirdPrice"
                id="EarlybirdPrice"
                className="input my-2"
                placeholder="$10"
                {...register("EarlybirdPrice")}
              />
              <p className="text-[red]">{errors?.EarlybirdPrice?.message}</p>
            </div>
            <div className="w-[50%]">
              <label
                htmlFor="RegularPrice"
                className="font-semibold items-center flex  gap-1"
              >
                Regular Price{" "}
                <span>
                  <img src={Images.info} className="w-4" />
                </span>
              </label>
        
              <input
                type="text"
                name="RegularPrice"
                id="RegularPrice"
                className="input my-2"
                placeholder="$10"
                {...register("RegularPrice")}
              />
              <p className="text-[red]">{errors?.RegularPrice?.message}</p>
            </div>
          </div>

        <div className="flex gap-2">
        <div className="my-2 flex-1">
            <label
              htmlFor="Availablespots"
              className="font-semibold flex items-center gap-1"
            >
              Available Spots{" "}
              <span>
                <img src={Images.info} className="w-4" />
              </span>
            </label>
            <input
              type="number"
              name="Availablespots"
              id="Availablespots"
              className="input my-2"
              placeholder="10"
              {...register("Availablespots")}
            />
            <p className="text-[red]">{errors?.Availablespots?.message}</p>
          </div>

         
        </div>

        <div className="my-4 flex justify-between items-center">
            <div className="left ">
              <p className="font-semibold">This Content is 18+</p>
            </div>
            <div>
              {" "}
              <label htmlFor="Eighteenplus" className="font-semibold flex">
                {/* This Content is 18+ */}
                <input
                  type="checkbox"
                  id="Eighteenplus"
                  name="Eighteenplus"
                  className="hidden"
                  checked={isChecked}
                  onChange={handleToggle}
                />
                <span
                  className={`relative inline-block w-10 h-6 transition-colors duration-300 ease-in-out rounded-full ml-4 ${
                    isChecked ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-300 ease-in-out ${
                      isChecked ? "translate-x-4" : ""
                    }`}
                  ></span>
                </span>
              </label>
            </div>
          </div>
            <div className="my-2">
            <label htmlFor="avathonDescription" className="font-semibold">
              Avathons Description
            </label>
            <textarea
              name="avathonDescription"
              rows={5}
              id="avathonDescription"
              className="input my-2 resize-none"
              placeholder="Type description"
              {...register("avathonDescription")}
            ></textarea>
            <p className="text-[red]">{errors?.avathonDescription?.message}</p>
          </div>
            <div className="my-2">
            <label htmlFor="aboutStream" className="font-semibold">
              Tell Admin what the stream will be about
            </label>
            <textarea
              name="aboutStream"
              rows={5}
              id="aboutStream"
              className="input my-2 resize-none"
              placeholder="Type what the stream will be about"
              {...register("aboutStream")}
            ></textarea>
            <p className="text-[red]">{errors?.aboutStream?.message}</p>
          </div>

            <div className="my-2">
              <button className="w-full my-6 rounded-md bottom-1 m-auto left-0 right-0 p-3 cursor-pointer bg-backgroundFill-900 text-white text-center">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default EditAvathonsPage;
