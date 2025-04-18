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
import { addExperinceValidation } from "@/utills/formvalidation/FormValidation";
import { editexperienceApi, getAvailableApi } from "@/utills/service/avtarService/AddExperienceService";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useRef, useState } from "react";

import toast from "react-hot-toast";
import Loader from "@/components/Loader";

function EditExperiencePage() {
  const navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const location = useLocation();
  const [removedImages, setRemovedImages] = useState([]);
  const params = useParams();
  const [isChecked, setIsChecked] = useState(false);
  const [countryid, setCountryid] = useState({
    id: undefined,
    name: undefined,
  });
  const [formValues, setFormValues] = useState({
    from: "",
    to: "",
    timeZone: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
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
  } = useForm({ resolver: yupResolver(addExperinceValidation) });
  const state = location?.state;

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
      if (file.type.startsWith("image/")) {
        setSelectedFile(file);
        setImageURL(URL.createObjectURL(file));
      } else {
        toast.error("Please upload a valid image file.");
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
      if (state?.bookinstaltly) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }

      setOtherImageURLs(state.images);
      if (state && state.images) {
        const imageURLs = state.images.map((image, index) => {
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

      setValue("ExperienceName", state?.ExperienceName);
      setValue("AmountsperMinute", state?.AmountsperMinute);
      setValue("notesForUser", state?.notesForUser);
      setValue("about", state?.about);
      setImageURL(state?.thumbnail);
      setCountryid({ id: state.country, name: state.country });
      setstateid({ id: state.state, name: state.State });
      setCityId({ id: state.suburb, name: state.city });
    }
    setLoader(false);
  }, [state, setValue]);

  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();

    // Append form fields
    formData.append("ExperienceName", data?.ExperienceName);
    formData.append("AmountsperMinute", data?.AmountsperMinute);
    formData.append("notesForUser", data?.notesForUser);
    formData.append("country", countryid.name);
    formData.append("about", data?.about);
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
      formData.append("thumbnail", selectedFile);
      formData.append("removeThumbnail", true);
    } else {
      formData.append("removeThumbnail", false);
    }

    for (let index = 0; index < newFiles.length; index++) {
      formData.append(`images`, newFiles[index]);
    }
    formData.append("removeImages", JSON.stringify(removedImages));
    formData.append("from", formValues.from);
    formData.append("to", formValues.to);
    formData.append("timeZone", formValues.timeZone.value);
    formData.append("timeahead", formValues.timeZone.offset.toString());
    try {
      const response = await editexperienceApi(params?.id, formData);
      if (response?.isSuccess) {
        navigate("/avatar/add-experience");
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
  const handleTimezoneChange = (selectedTimezone) => {
    setFormValues((prevValues) => ({
      ...prevValues,
      timeZone: selectedTimezone,
    }));
  };
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await getAvailableApi();
    
      if (res?.isSuccess) {
        const data = res.data;

        // Convert 'from' and 'to' to the 'HH:MM' format
        const fromTime = formatTimeToHHMM(data.from);
        const toTime = formatTimeToHHMM(data.to);

        setFormValues({
          from: fromTime || "",
          to: toTime || "",
          timeZone: {
            value: data.timeZone || "",
            offset: parseFloat(data.timeahead) || 0,
          },
        });
      }
    };

    fetchData();
  }, []);


  return (
    <>
      {loader && <Loader />}
      <div className="px-4">
        <HeaderBack link="/avatar/add-experience" text={"Edit Experience"} />
        <TitleHeading title={"Experience Images"} />

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex justify-between my-4 flex-wrap">
            <div className="w-[49%] relative">
              <div className="absolute top-2 right-2 flex gap-2">
                {/* <div className="bg-white p-4 sm:p-2 rounded-md BoxShadowLessRounded">
                <img src={Images.rotate} alt="edit" className="cursor-pointer w-6 h-6" />
              </div> */}
                {selectedFile !== "" && (
                  <div className="cursor-pointer bg-white p-4 sm:p-2 rounded-md BoxShadowLessRounded">
                    <img
                      onClick={handleRemoveMainImage}
                      src={Images.close}
                      alt="remove"
                      className="cursor-pointer w-6 h-6"
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
                    accept="image/*"
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
                <img
                  src={imageURL}
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
              <label htmlFor="ExperienceName" className="font-semibold">
                Experience Name
              </label>
              <input
                type="text"
                name="ExperienceName"
                id="ExperienceName"
                className="input my-2"
                {...register("ExperienceName")}
              />
              <p className="text-[red] sm:text-sm">
                {errors?.ExperienceName?.message}
              </p>
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

            <div className="my-2">
              <label htmlFor="AmountsperMinute" className="font-semibold">
                Add Amount Per Minutes
              </label>
              <input
                type="text"
                name="AmountsperMinute"
                id="AmountsperMinute"
                className="input my-2"
                placeholder={`${getCurrencySymbol()}5`}
                {...register("AmountsperMinute")}
              />
              <p className="text-[red] sm:text-sm">
                {errors?.AmountsperMinute?.message}
              </p>
            </div>

            <div className="my-4 flex justify-between items-center">
              <div className="left">
                {" "}
                <label htmlFor="notesForUser" className="font-semibold flex">
                  Add Public Live
                  <input
                    type="checkbox"
                    id="notesForUser"
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
              {/* <div className="border-2 border-[#FF7070] p-4 rounded-lg px-6">
              <img src={Ima
              ges.InstantLiveText} alt="InstantLiveText" />
            </div> */}
         
            </div>
            <div className=" ">
          <h1 className="text-center">Update Your  Availablility</h1>
          <div className="flex sm:block justify-between gap-4 ">
          
              <div className=" flex-1  mt-2">
                <div className="py-2 rounded-md">
                  <h3 className="font-normal mb-2">From</h3>
                  <div className="grid w-full items-center gap-1.5">
                    <input
                      type="time"
                      id="from"
                      name="from"
                      value={formValues.from}
                      onChange={handleChange}
                      className="outline-none border border-[#ccc] p-2 rounded-md w-full"
                    />
                  </div>
             
                </div>
              </div>

              <div className="flex-1 mt-2">
                <div className="py-2 rounded-md">
                  <h3 className="font-normal mb-2">To</h3>
                  <input
                    type="time"
                    id="to"
                    name="to"
                    value={formValues.to}
                    onChange={handleChange}
                    className="outline-none border border-[#ccc] p-2 rounded-md w-full"
                  />

                </div>
              </div>

              <div className="flex-1 mt-2">
                <label htmlFor="timeZone" className="mb-2 block">
                  Time Zone
                </label>
                <TimezoneSelect
                  value={formValues.timeZone}
                  onChange={handleTimezoneChange}
                  className="outline-none border border-[#ccc] p-2 rounded-md w-full"
                />
            
              </div>

              
          </div>
        </div>
            <div className="my-2">
              <label htmlFor="about" className="font-semibold">
                About
              </label>
              <textarea
                name="about"
                rows={2}
                id="about"
                className="input my-2 resize-none"
                placeholder="Enter About this experience"
                {...register("about")}
              ></textarea>
              <p className="text-[red] sm:text-sm">{errors?.about?.message}</p>
            </div>
            <div className="my-2">
              <label htmlFor="notesForUser" className="font-semibold">
                Notes for Users
              </label>
              <textarea
                name="notesForUser"
                rows={5}
                id="notesForUser"
                className="input my-2 resize-none"
                placeholder="Lorem Ipsum is simply dummy text of the printing and typesetting industry."
                {...register("notesForUser")}
              ></textarea>
              <p className="text-[red] sm:text-sm">
                {errors?.notesForUser?.message}
              </p>
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

export default EditExperiencePage;
