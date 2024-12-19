import { useEffect, useRef, useState } from "react";
import moment from "moment";
import Images from "@/constant/Images";
import socket from "@/utills/socket/Socket";
import { getCurrencySymbol } from "@/constant/CurrencySign";

import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { Link } from "react-router-dom";
const InstantLiveRequestModal = ({
  instantLiveModalState,
  setInstantLiveModalState,
  instanreq,
  role,
}) => {
  const modalRef = useRef();

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setInstantLiveModalState();
    }
  };

  const userId = getLocalStorage("user")?._id;
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [meetLink, setMeetLink] = useState("");
  const [eventId, setEventId] = useState("");
  const [duration, setDuration] = useState(30); // Default duration 30 minutes
  const [startTime, setStartTime] = useState("");
  const [countdown, setCountdown] = useState("");
  const [isAccepted, setIsAccepted] = useState(false); // Track whether the request is
  const [meetActive, setMeetActive] = useState(false); // Track if the meeting is active
  const [meetWindow, setMeetWindow] = useState(null);

  

  useEffect(() => {
    
    socket.connect();
  }, []);






;

  useEffect(() => {
    socket.emit("instantLive", userId);

    return () => {
      socket.emit("userOffline", userId);
      socket.off("instantLive");
    };
  }, [userId]);

  useEffect(() => {
    if (instantLiveModalState) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [instantLiveModalState]);

  if (!instantLiveModalState) return null;

  return (
    <div className="fixed top-0 flex items-start justify-center inset-0 bg-black bg-opacity-50 z-[99]">
      <div
        ref={modalRef}
        className="bg-white BoxShadowModalTop rounded-b-2xl px-7 shadow-lg w-full max-w-4xl xl:max-w-2xl lg:max-w-[90%] p-3 sm:px-2 sm:py-1"
      >
        {/*  */}

        <div className=" pb-2">
          <h1 className="text-center py-2">Public Live Requests</h1>
          <div className="flex gap-4 p-4 sm:flex-wrap sm:px-2">
            <div className="sm:w-[100%] relative w-[30%]">
              <img
                src={instanreq?.finddetails?.thumbnail}
                alt="cardImageRounded"
                className="m-auto w-[90%] h-[110px] sm:w-full object-cover sm:h-[200px] rounded-lg"
              />
            </div>
            <div className="w-[80%] sm:w-[100%]">
              <h2 className="text-2xl font-bold  sm:text-sm">
                {getCurrencySymbol()}
                {instanreq?.finddetails?.AmountsperMinute}
              </h2>
              <h2 className="text-lg font-bold  sm:text-sm">
                {instanreq?.finddetails?.ExperienceName}
              </h2>

              <div className="flex justify-between items-center gap-2 py-1">
                <div className="icon">
                  <img
                    src={Images.location2}
                    alt="location"
                    className="w-5 h-5"
                  />
                </div>
                <div className="flex-1">
                  {instanreq?.finddetails?.city},
                  {instanreq?.finddetails?.country}
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between m-auto w-[94%] py-2 text-grey-800">
            <button
              className="border border-primaryColor-900 text-black font-semibold py-2 rounded mr-2 w-[50%]"
              onClick={() => setInstantLiveModalState(false)}
            >
              {role === "avatar" ? "Deny" : "Cancel"}
            </button>
            {role === "avatar" ? (
              meetLink ? (
                <Link
                  className="bg-black text-white text-center py-2 rounded  w-[50%]"
                  to={meetLink}
                >
                  <button className="bg-black text-white py-2 rounded  w-[50%]">
                    Join{" "}
                  </button>
                </Link>
              ) : (
                <button
                  onClick={acceptinvite}
                  className="bg-black text-white py-2 rounded  w-[50%]"
                >
                  Accept
                </button>
              )
            ) : (
              <Link
                className="bg-black text-white text-center py-2 rounded  w-[50%]"
                to={instanreq?.link}
              >
                <button className="bg-black text-white py-2 rounded  w-[50%]">
                  Join{" "}
                </button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantLiveRequestModal;
