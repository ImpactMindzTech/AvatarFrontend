import { useEffect, useState, useContext } from "react";
import "./App.css";
import socket from "./utills/socket/Socket";
import { RouterProvider } from "react-router-dom";
import router from "./router/Routing";
import { Toaster } from "react-hot-toast";
import "react-country-state-city/dist/react-country-state-city.css";
import { SocketContext } from "./store/notification";
import MeetingNotification from "./components/Modal/MeetingNotification";
import { getLocalStorage } from "./utills/LocalStorageUtills";
import OfferNotification from "./components/Modal/OfferNotification";
import toast from "react-hot-toast";
import Images from "./constant/Images";

function App() {
  const { meetLink, meetingData, rid, offerdata } = useContext(SocketContext);
  const getroom = getLocalStorage("notificationData")?.roomId;
  const [copyMessage, setCopyMessage] = useState(false);

  const [isWebView, setIsWebView] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);

  useEffect(() => {
    socket.connect();
    console.log('connected to server')
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    const isIOSWebView =
      /iPhone|iPod|iPad/i.test(userAgent) && !/Safari/i.test(userAgent);
    const isAndroidWebView =
      /Android/.test(userAgent) && /wv/.test(userAgent);

    if (isIOSWebView || isAndroidWebView) {
      setIsWebView(true);
      setIsIOS(isIOSWebView);
      setIsAndroid(isAndroidWebView);
    }
  }, []);

  const openInBrowser = () => {
    const browserURL = window.location.href;

    if (isAndroid) {
      // Open in Chrome on Android
      window.location.href = `intent://${browserURL.replace(
        /^https?:\/\//,
        ""
      )}#Intent;scheme=https;package=com.android.chrome;end`;
    } else if (isIOS) {
      // Use navigator.share for iOS to prompt user to share the link
      if (navigator.share) {
        navigator.share({
          title: document.title,
          url: `https://${browserURL.replace(/^https?:\/\//, "")}`,
        })
          .then(() => console.log('Link shared successfully'))
          .catch((error) => console.log('Error sharing link:', error));
      } else {
        // Fallback: If share isn't supported, show a message or open in a new window
        const anchor = document.createElement('a');
        anchor.href = `https://${browserURL.replace(/^https?:\/\//, "")}`;
        anchor.target = '_blank'; // Opens in a new tab
        anchor.rel = 'noopener noreferrer'; // For security reasons
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor); // Remove the anchor element
      }
    }
  };
  // Render only button if WebView is detected
  if (isWebView) {
    const copyToClipboard = () => {

      const currentURL = window.location.href;
      toast.success("Link copied to clipboard!");
      navigator.clipboard
        .writeText(currentURL)
        .then(() => {
          setCopyMessage(true);
          toast.success("Link copied to clipboard!");
          setTimeout(() => setCopyMessage(false), 5000);
        })
        .catch((error) => {
          console.error("Failed to copy link: ", error);
          toast.error("Failed to copy link. Try again!");
        });
       
    };
    return (
      <div className="webview-overlay">
        <div className="content-container">
          <RouterProvider router={router} />
        </div>
        <div className="button-container">
        <p className="webview-message py-2 p-2 font-semibold">
          For a seamless experience, please open this website in your browser.<a
            onClick={(e) => {
              e.preventDefault();
              copyToClipboard();
            }}
            className="text-blue-400 cursor-pointer"
          >
            Copy Link
          </a>
        </p>
      
          <button onClick={openInBrowser} className="open-in-browser-button">
            Open in  Browser
          </button>
         {/* Display the copy message */}
      
        </div>
        {copyMessage && (
          <div className="copy-message">
            Link copied to clipboard!
          </div>
        )}
      </div>
    );
  }

  // Normal app content when not in WebView
  return (
    <>
      {meetLink && <MeetingNotification data={meetingData} />}
      {rid && <OfferNotification data={offerdata} />}

      <Toaster
        reverseOrder={false}
        toastOptions={{
          success: {
            duration: 20000,
            style: {
              backgroundColor: "#f0fdf4",
              color: "#166534",
            },
            icon: (
              <img
                src={Images.close}
                alt="Close"
                onClick={() => toast.dismiss()}
                style={{ cursor: "pointer" }}
              />
            ),
          },
          error: {
            style: {
              backgroundColor: "#fef2f2",
              color: "#991b1b",
            },
            duration: 20000,
            icon: (
              <img
                src={Images.close}
                alt="Close"
                onClick={() => toast.dismiss()}
                style={{ cursor: "pointer" }}
              />
            ),
          },
        }}
      />

      <RouterProvider router={router} />
    </>
  );
}

export default App;
