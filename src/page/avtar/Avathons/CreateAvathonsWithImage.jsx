import EditExperienceCard from "@/components/Avatar/Card/EditExperienceCard";
import TitleHeading from "@/components/Avatar/Heading/TitleHeading";
import HeaderBack from "@/components/HeaderBack";
import Images from "@/constant/Images";
import { useState, useRef, useEffect } from "react";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { addExperinceValidation, createAvathonsValidation } from "@/utills/formvalidation/FormValidation";
import { AddexperienceApi, getAvailableApi } from "@/utills/service/avtarService/AddExperienceService";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Loader from "@/components/Loader";
import Dropdown from "@/components/statecitycountry/DropDown";
import TimezoneSelect from "react-timezone-select";
import { Button } from "@/components/ui/button";
import { formatTimeToHHMM } from "@/constant/date-time-format/DateTimeFormat";
import { CreateAvathonsApi } from "@/utills/service/avtarService/CreateAvathonsService";

const CreateAvathonsWithImagePage = () => {
 const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedTime, setSelectedTime] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [disable, Setdisable] = useState(false);

  const [loading, setLoader] = useState(false);
  const navigate = useNavigate();
  const [isChecked, setIsChecked] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [otherSelectedFiles, setOtherSelectedFiles] = useState([]);
  const [imageURL, setImageURL] = useState(null);
  const [videoURL, setVideoURL] = useState(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const videoInput = useRef(null);
  const [otherImageURLs, setOtherImageURLs] = useState([]);
  const mainImage = useRef(null);
  const otherImage = useRef(null);
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ resolver: yupResolver(createAvathonsValidation) });

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

  // const handleFileChange = (e) => {
  //   if (e.target.files && e.target.files.length > 0) {
  //     const file = e.target.files[0];

  //     if (!file.type.startsWith("image/")) {
  //       toast.error("Please select a valid image file.");
  //       return;
  //     }

  //     setSelectedFile(file);
  //     setImageURL(URL.createObjectURL(file));
  //   }
  // };
  const handleOtherFileChange = (e) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);

      const validFiles = files.filter((file) => {
        if (!file.type.startsWith("image/")) {
          toast.error(
            `Invalid file detected: ${file.name}. Please select only image files.`
          );
          return false;
        }
        return true;
      });

      if (validFiles.length > 0) {
        setOtherSelectedFiles((prevFiles) => [...prevFiles, ...validFiles]);
        setOtherImageURLs((prevURLs) => [
          ...prevURLs,
          ...validFiles.map((file) => URL.createObjectURL(file)),
        ]);
      }
    }
  };

 // Handle video file change
 const handleFileChange = (e) => {
  if (e.target.files && e.target.files.length > 0) {
    const file = e.target.files[0];

    if (!file.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }
 
    // Create a URL for the video file
    const videoObjectURL = URL.createObjectURL(file);
    setVideoURL(videoObjectURL);

    setSelectedFile(file);

    // Create a video element to check the duration
    const videoElement = document.createElement("video");
    videoElement.src = videoObjectURL;

    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration;
      if (duration > 30) {
        toast.error("Video must be less than or equal to 30 seconds.");
        setVideoURL(null);
        setSelectedFile(null);
      } else {
        setVideoDuration(duration);
      }
    };
  }
};

// Handle video remove
const handleRemoveVideo = () => {
  setVideoURL(null);
  setSelectedFile(null);
  setVideoDuration(0);
};

  const handleRemoveOtherImage = (index) => {
    const updatedFiles = otherSelectedFiles.filter((_, i) => i !== index);
    const updatedURLs = otherImageURLs.filter((_, i) => i !== index);
    setOtherSelectedFiles(updatedFiles);
    setOtherImageURLs(updatedURLs);
  };

  const fetchCoordinates = async (country, state = "", city = "") => {
    try {
      let query = "";
      if (city) {
        query = `${city},${state},${country}`;
      } else if (state) {
        query = `${state},${country}`;
      } else {
        query = `${country}`;
      }

      const encodedQuery = encodeURIComponent(query);

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodedQuery}&format=json&limit=1`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];

        return { lat, lon };
      }

      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Handle date change

  const onSubmit = async (data) => {
    if (!selectedFile) {
      toast.error("Please Select a Video");
      return;
    }
    const formData = new FormData();
    if (!selectedCountry) {
      toast.error("Please Select Country");
      return;
    }
    const coordinates = await fetchCoordinates(
      selectedCountry.name,
      selectedState?.name,
      selectedCity
    );

    formData.append("AvathonName", data?.AvathonName);
    formData.append("country", selectedCountry.name);
    formData.append("State", selectedState?.name || "");
    formData.append("city", selectedCity || "");
    formData.append("avathonDate", selectedDate || "");
    formData.append("Time", selectedTime || "");
    formData.append("EarlybirdPrice",data?.EarlybirdPrice);
    formData.append("RegularPrice", data?.RegularPrice);
    formData.append("avathonDescription",data?.avathonDescription);
    formData.append("aboutStream", data?.aboutStream);
    formData.append("Availablespots", data?.Availablespots);
    formData.append("Eighteenplus", isChecked);
    formData.append("lat", coordinates.lat);
    formData.append("lng", coordinates.lon);

    formData.append(`video`, selectedFile);
 
    for (let index = 0; index < otherSelectedFiles.length; index++) {
      formData.append(`images`, otherSelectedFiles[index]);
    }
        
    try {
      setLoader(true);
      const response = await CreateAvathonsApi(formData);
      setLoader(false);

      if (response?.isSuccess) {
        toast.success(response?.message);
        Setdisable(false);
        navigate("/avatar/create-avathons");
      }
    } catch (error) {
      console.error("API error: ", error);
      Setdisable(false)
    }
  };

  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    fetch("/countries.json")
      .then((response) => response.json())
      .then((data) => {
        const countryList = data.map((country) => ({
          name: country.name,
          code: country.isoCode,
        }));
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  useEffect(() => {
    if (selectedCountry) {
      fetch("/states.json")
        .then((response) => response.json())
        .then((data) => {
          const filteredStates = data.filter(
            (state) => state.countryCode === selectedCountry.code
          );
          setStates(
            filteredStates.map((state) => ({
              name: state.name,
              code: state.isoCode,
            }))
          );
          setSelectedState(null);
          setSelectedCity(null);
          setCities([]);
        })
        .catch((error) => console.error("Error fetching states:", error));
    } else {
      setStates([]);
      setCities([]);
      setSelectedState(null);
      setSelectedCity(null);
    }
  }, [selectedCountry]);

  useEffect(() => {
    if (selectedState) {
      fetch("/cities.json")
        .then((response) => response.json())
        .then((data) => {
          const filteredCities = data.filter(
            (city) =>
              city.stateCode === selectedState.code &&
              city.countryCode === selectedCountry.code
          );
          setCities(
            filteredCities.map((city) => ({
              name: city.name,
            }))
          );
          setSelectedCity(null);
        })
        .catch((error) => console.error("Error fetching cities:", error));
    } else {
      setCities([]);
      setSelectedCity(null);
    }
  }, [selectedState, selectedCountry]);
 



 
  return (
    <>
      {loading && <Loader />}
      <div className="px-4">
        <HeaderBack link="/avatar/create-avathons" text={"Create Avathons"} />
        <TitleHeading title={"Add Avathons Images"} />

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex justify-between my-4 flex-wrap">
            <div className="w-[49%] relative">
              <div className="absolute top-2 right-2 flex gap-2">
              
                {selectedFile && (
                  <div
                    className="cursor-pointer bg-white p-4 sm:p-2 rounded-md BoxShadowLessRounded"
                    onClick={handleRemoveVideo}
                  >
                    <img
                      src={Images.close}
                      alt="remove"
                      className="cursor-pointer w-6 h-6"
                    />
                  </div>
                )}
              </div>



              

              {!videoURL  ? (
                <div
                onClick={() => videoInput.current.click()}
                  className="border rounded-lg w-full  h-[240px] sm:h-[140px] bg-[#f2f2f2] border-[#e2e2e2] flex justify-center items-center flex-col cursor-pointer group py-5"
                >
                   <input
                    className="hidden"
                    onChange={handleFileChange}
                    ref={videoInput}
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
                    Add Video
                  </h1>
                  <span className="text-center text-grey-800 pt-2 font-semibold group-hover:text-grey-900 sm:text-base">Less than 30 seconds</span>
                </div>
              ) : (
                <div className="relative w-full h-[240px] sm:h-[140px]">
                  <video
                    src={videoURL}
                    controls
                    className="w-full h-full object-cover rounded-2xl"
                  />
                  <div className="absolute top-0 right-0 bg-white p-2 rounded-full cursor-pointer" onClick={handleRemoveVideo}>
                    <img src={Images.close} alt="remove" className="w-6 h-6" />
                  </div>
                </div>
              )}
               {videoDuration > 0 && (
                <p className="text-center text-gray-600 mt-2">{`Duration: ${Math.floor(videoDuration)} seconds`}</p>
              )}
              
            </div>

            <div className="w-[49%] h-full relative">
              <div
                onClick={handleOtherImageClick}
                className="border  h-[240px] sm:h-[140px] rounded-lg w-full bg-[#f2f2f2] border-[#e2e2e2] flex justify-center items-center flex-col group cursor-pointer py-5"
              >
                <input
                  className="hidden"
                  onChange={handleOtherFileChange}
                  ref={otherImage}
                  type="file"
                  multiple
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
                  Add Images
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
            <label htmlFor="exp-name" className="font-semibold">
              Country
            </label>
            <Dropdown
              data={countries.map((c) => c.name)}
              selectedValue={selectedCountry?.name || ""}
              onChange={(name) => {
                const country = countries.find((c) => c.name === name);
                setSelectedCountry(country || null);
              }}
              placeholder="Select Country"
            />
            <p className="text-[red]">{errors?.country?.message}</p>
            {/* State Dropdown */}
            <label htmlFor="exp-name" className="font-semibold">
              State
            </label>
            <Dropdown
              data={states.map((s) => s.name)}
              selectedValue={selectedState?.name || ""}
              onChange={(name) => {
                const state = states.find((s) => s.name === name);
                setSelectedState(state || null);
              }}
              placeholder="Select State"
              disabled={!selectedCountry}
            />
            <p className="text-[red]">{errors?.State?.message}</p>

            {/* City Dropdown */}
            <label htmlFor="exp-name" className="font-semibold">
              City
            </label>
            <Dropdown
              data={cities.map((c) => c.name)}
              selectedValue={selectedCity || ""}
              onChange={setSelectedCity}
              placeholder="Select City"
              disabled={!selectedState}
            />
            <p className="text-[red]">{errors?.city?.message}</p>
          </div>

          <div className="my-2 flex gap-2 items-center w-full ">
            <div className="w-[50%]">
              <label htmlFor="SelectedDate" className="font-semibold">
                Selected Date
              </label>
              <input
                type="date"
                name="avathonDate"
                id="avathonDate"
                className="input my-2 "
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}

              />
              <p className="text-[red]">{errors?.avathonDate?.message}</p>
            </div>
            <div className="w-[50%]">
              <label htmlFor="SelectedTime" className="font-semibold">
                Selected Time
              </label>
              <input
                type="time"
                name="Time"
                id="Time"
                className="input my-2"
                value={selectedTime}
          
                onChange={(e) => setSelectedTime(e.target.value)}
              />
              <p className="text-[red]">{errors?.Time?.message}</p>
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
                type="Number"
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
              {/* <div className="font-semibold flex items-center gap-1">
                <div>Regular Price</div>
                <div><img src={Images.info} className="w-4"/></div>
            </div> */}
              <input
                type="number"
                name="RegularPrice"
                id="RegularPrice"
                className="input my-2"
                placeholder="$10"
                {...register("RegularPrice")}
              />
              <p className="text-[red]">{errors?.RegularPrice?.message}</p>
            </div>
          </div>

          <div className="my-2">
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
            <button
              disabled={disable}
              type="submit"
              className={`w-full my-6 rounded-md bottom-1 m-auto left-0 right-0 p-3 cursor-pointer text-white text-center ${
                disable ? "bg-gray-400" : "bg-backgroundFill-900"
              }`}
            >
              Add for Admin approval
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default CreateAvathonsWithImagePage;

