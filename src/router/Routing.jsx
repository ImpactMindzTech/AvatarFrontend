import { createBrowserRouter, useNavigate } from "react-router-dom";

import Root from "./Root";
import AuthProtected from "@/authentication/AuthProteced";
import AuthLayout from "@/Layout/AuthLayout";
import Login from "@/page/auth/Login";
import SignUp from "@/page/auth/SignUp";
import ForgetPassword from "@/page/auth/ForgetPassword";
import UserProtected from "@/authentication/UserProtected";
import DashboardLayout from "@/Layout/DashboardLayout";
import Home from "@/page/user/home/Home";
import OtpVerify from "@/page/auth/OtpVerify";
import ConfirmPassword from "@/page/auth/ConfirmPassword";
import Role from "@/page/auth/Role";
import Address from "@/page/auth/Address";
import RecordedPage from "@/page/user/record/RecordedPage";
import OfferSuccessPage from "@/page/user/offers/OfferSuccessPage";
import AccountInfo from "@/page/user/AccountInfo";
import ChatAndSupport from "@/page/user/chatandsupport/ChatAndSupport";
import ChatUser from "@/page/user/chat/ChatUser";
import AvatarProfile from "@/page/user/avatar/AvatarProfile";
import Filters from "@/page/user/Filters";
import Report from "@/page/user/Report";
import Book_Experience_Details from "@/page/user/home/Book_Experience_Details";
import PaymentPage from "@/page/user/Payment";
import See_All_Review from "@/page/user/See_All_Review";
import Notification from "@/page/user/Notification";
import Booking from "@/page/user/home/Booking";
import Confirm_Pay from "@/page/user/home/Confirm_Pay";
import OfferConfirmPay from "@/page/user/home/OfferConfirmPay";
import Payment_Success from "@/page/user/Payment_Success";
import OfferPayment_Success from "@/page/user/OfferPayment_Success";
import Experience from "@/page/user/experience/Experience";
import Update_Experience from "@/page/user/Update_Experience";
import ChatWithAvatar from "@/page/user/ChatWithAvatar";
import RateTour from "@/page/user/RateTour";
import Tip from "@/page/user/Tip";
import Chat from "@/page/user/Chat";
import Profile from "@/page/user/profile/Profile";
import EditProfile from "@/page/user/profile/Edit_Profile";
import AvatarProtected from "@/authentication/AvatarProtected";
import AvatarLayout from "@/Layout/AvatarLayout";
import AvtarHome from "@/page/avtar/AvtarHome";
import ExperiencePage from "@/page/avtar/Experience/ExperiencePage";
import OffersPage from "@/page/avtar/Offers/OffersPage";
import EditProfileAvatar from "@/page/avtar/Profile/EditProfileAvatar";
import ChatPageAvatar from "@/page/avtar/Chat/ChatPage";
import ChatWithUser from "@/page/avtar/Chat/ChatWithUser";
import BankAccountPage from "@/page/avtar/Bank/BankAccountPage";
import StripeAccountPage from "@/page/avtar/Bank/StripeAccountPage";
import AccountInfoPage from "@/page/avtar/AccountInfoPage";
import InstantCashPage from "@/page/avtar/Bank/InstantCashPage";
import AddNewExperiencePage from "@/page/avtar/Experience/AddNewExperiencePage";
import AddNewExperienceNewPage from "@/page/avtar/Experience/AddNewExperienceNewPage";
import EarningPage from "@/page/avtar/Earnings/EarningPage";
import PerformancePage from "@/page/avtar/performance/PerformancePage";
import EditExperiencePage from "@/page/avtar/Experience/EditExperiencePage";
import Offers from "@/page/user/offers/OffersPage";
import Payment_Failed from "@/page/user/Payment_Failed";
import Privacy from "@/page/user/Privacy";
import Terms from "@/page/user/Terms";
import MyExperienceList from "@/page/avtar/Experience/MyExperienceList";
import Reports from "@/page/avtar/Reports";
import MainHomePage from "@/page/homepage/MainHomePage";
import InstantLive from "@/page/user/InstantLive";
import ExploreMap from "@/page/user/ExploreMap/ExploreMap";
import Allmap from "@/page/user/ExploreMap/Allmap";
import MobileDevice from "@/page/auth/MobileDevice";
import AddExperienceWithImagePage from "@/page/avtar/Experience/AddExperienceWithImage";
import MainLayout from "@/Layout/MainLayout";
import MainFilters from "@/page/user/MainFilters";
import MainBookExperienceDetails from "@/page/user/home/MainBookExperienceDetails";
import MainSeeAllReviews from "@/page/user/MainSeeAllReviews";
import RoomCreate from "@/page/Room";
import RoomJoin from "@/page/Room";
import AvathonCreate from "../page/Avathons";
import AvathonJoin  from "../page/Avathons"

import Payment_Success_Join_Room from "@/page/user/Payment_Success_Join_Room";
import NewPage from "@/page/user/NewPage";
// import Room from "@/page/Room";
import Username from "@/page/auth/Username";
import CustomAlert from "@/page/custom_alert/CustomAlert";
import HaveGimbal from "@/page/have_gimbal/HaveGimbal";
import AddSuccess from "@/page/user/AddSuccess";
import Tip_success from "@/page/user/TipSuccess";
import Error404 from "@/page/Error404";
import ReportBug from "@/components/Report/Reportbug";
import PaypalAccountPage from "@/page/avtar/Bank/PaypalAccountPage";
import CheckOut from "@/page/user/checkout/CheckOut";
import CreateNewAvathonsPage from "@/page/avtar/Avathons/CreateNewAvathonsPage";
import CreateAvathonsWithImagePage from "@/page/avtar/Avathons/CreateAvathonsWithImage";
import EditAvathonsPage from "@/page/avtar/Avathons/EditAvathonsPage";
import MainBookAvathonDetails from "@/page/user/home/MainBookAvathonDetails";
import Book_Avathon_Details from "@/page/user/home/Book_Avathon_Details";
import AvathonConfirmPay from "@/page/user/home/AvathonConfirmPay";
import Avathonrate from "@/page/user/avathonRate";
import Avathontip from "@/page/user/avathonTip";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <MainLayout>
        <MainHomePage />
      </MainLayout>
    ),
    // element: <Root />,
    errorElement:<Error404/>
  },
  

  {
    path: "/filters",
    element: (
      <MainLayout>
        <MainFilters />
      </MainLayout>
    ),
  },
 
  {
    path: "/book-experience/:id",
    element: (
      <MainLayout>
        <MainBookExperienceDetails />
      </MainLayout>
    ),
  },
  {
    path: "/booking/:id",
    element: (
      <MainLayout>
        <Booking />
      </MainLayout>
    ),
  },
  {
    path: "/avatar-profile/:id",
    element: (
      <MainLayout>
        <AvatarProfile />
      </MainLayout>
    ),
  },
  {
    path: "/see-all-review/:id",
    element: (
      <MainLayout>
        <MainSeeAllReviews />
      </MainLayout>
    ),
  },
  {
    path: "/mobile",
    element: (
      <AuthLayout>
        <MobileDevice />
      </AuthLayout>
    ),
    // element: <Root />,
  },
  {
    path: "/term",
    element: <Terms />,
    // element: <Root />,
  },
  {
    path: "/admin/room_join/:id",
    element: <RoomJoin />,
    // element: <Root />,
  },

  {
    path: "/privacy",
    element: <Privacy />,
    // element: <Root />,
  },
  {
    path: "/book-avathon/:id",
    element: (
      <MainLayout>
        <MainBookAvathonDetails />
      </MainLayout>
    ),
  },


  {
    path: "/auth",
    element: <AuthProtected />,
    children: [
      {
        path: "login",
        element: (
          <AuthLayout>
            <Login />
          </AuthLayout>
        ),
      },
      {
        path: "signup",
        element: (
          <AuthLayout>
            {" "}
            <SignUp />
          </AuthLayout>
        ),
      },
      {
        path: "forget-password",
        element: (
          <AuthLayout>
            <ForgetPassword />
          </AuthLayout>
        ),
      },
      {
        path: "otp-verify/:id",
        element: (
          <AuthLayout>
            <OtpVerify />
          </AuthLayout>
        ),
      },
      {
        path: "new-password/:id",
        element: (
          <AuthLayout>
            <ConfirmPassword />
          </AuthLayout>
        ),
      },
      {
        path: "role/:user",
        element: (
          <AuthLayout>
            <Role />
          </AuthLayout>
        ),
      },
      {
        path: "username/:user",
        element: (
          <AuthLayout>
            <Username />
          </AuthLayout>
        ),
      },

      {
        path: "address/:id",
        element: (
          <AuthLayout>
            <Address />
          </AuthLayout>
        ),
      },
      {
        path: "mobile/:id",
        element: (
          <AuthLayout>
            <MobileDevice />
          </AuthLayout>
        ),
      },
      
    ],
  },
  {
    path: "/user",
    element: <UserProtected />,
    children: [
      {
        path: "dashboard",
        element: (
          <DashboardLayout>
            <Home />
          </DashboardLayout>
        ),
      },
      {
        path: "Bugreport",
        element: (
          <DashboardLayout>
            <ReportBug/>
          </DashboardLayout>
        ),
      },
      {
        path: "recorded",
        element: (
          <DashboardLayout>
            <RecordedPage />
          </DashboardLayout>
        ),
      },
      {
        path: "offers",
        element: (
          <DashboardLayout>
            <Offers />
          </DashboardLayout>
        ),
      },
      {
        path: "offer-success",
        element: (
          <DashboardLayout>
            <OfferSuccessPage />
          </DashboardLayout>
        ),
      },
      {
        path: "account-info",
        element: (
          <DashboardLayout>
            <AccountInfo />
          </DashboardLayout>
        ),
      },
      {
        path: "room_join/:id",
        element: <RoomJoin />,
        // element: <Root />,
      },
      {
        path: "avathon_join/:id",
        element: <AvathonJoin />,
        // element: <Root />,
      },
      {
        path: "chat-support",
        element: (
          <DashboardLayout>
            <ChatAndSupport />
          </DashboardLayout>
        ),
      },
      {
        path: "chat-support",
        element: (
          <DashboardLayout>
            <ChatAndSupport />
          </DashboardLayout>
        ),
      },
      {
        path: "ChatUser/:id",
        element: (
          <DashboardLayout>
            <ChatUser />
          </DashboardLayout>
        ),
      },
      {
        path: "avatar-profile/:id",
        element: (
          <DashboardLayout>
            <AvatarProfile />
          </DashboardLayout>
        ),
      },
      {
        path: "filters",
        element: (
          <DashboardLayout>
            <Filters />
          </DashboardLayout>
        ),
      },
      {
        path: "report/:id",
        element: (
          <DashboardLayout>
            <Report />
          </DashboardLayout>
        ),
      },
      {
        path: "book-experience/:id",
        element: (
          <DashboardLayout>
            <Book_Experience_Details />
          </DashboardLayout>
        ),
      },
      // {
      //   path: "payment",
      //   element: (
      //     <DashboardLayout>
      //       <PaymentPage />
      //     </DashboardLayout>
      //   ),
      // },
      {
        path: "payment",
        element: (
          <DashboardLayout>
            <PaymentPage />
          </DashboardLayout>
        ),
      },
      {
        path: "see-all-review/:id",
        element: (
          <DashboardLayout>
            <See_All_Review />
          </DashboardLayout>
        ),
      },

      {
        path: "notification",
        element: (
          <DashboardLayout>
            <Notification />
          </DashboardLayout>
        ),
      },
      {
        path: "booking/:id",
        element: (
          <DashboardLayout>
            <Booking />
          </DashboardLayout>
        ),
      },

      {
        path: "confirm-and-pay/:id",
        element: (
          <DashboardLayout>
            <Confirm_Pay />
          </DashboardLayout>
        ),
      },
      {
        path: "offer_confirm/:id",
        element: (
          <DashboardLayout>
            <OfferConfirmPay />
          </DashboardLayout>
        ),
      },
      {
        path: "paymentsuccess",
        element: (
          <DashboardLayout>
            <Payment_Success />
          </DashboardLayout>
        ),
      },
      {
        path: "offerpaymentsuccess",
        element: (
          <DashboardLayout>
            <OfferPayment_Success/>
          </DashboardLayout>
        ),
      },
      {
        path: "tipsuccess",
        element: (
          <DashboardLayout>
            <Tip_success/>
          </DashboardLayout>
        ),
      },
      {
        path: "addtimepaymentsuccess",
        element: (
          <DashboardLayout>
            <AddSuccess />
          </DashboardLayout>
        ),
      },
      {
        path: "alert",
        element: (
          <DashboardLayout>
            <CustomAlert />
          </DashboardLayout>
        ),
      },
      {
        path: "have-gimbal",
        element: (
          <DashboardLayout>
            <HaveGimbal />
          </DashboardLayout>
        ),
      },
      {
        path: "Payment_Success_Join_Room",
        element: (
          <DashboardLayout>
            <Payment_Success_Join_Room />
          </DashboardLayout>
        ),
      },
      {
        path: "paymentfailed",
        element: (
          <DashboardLayout>
            <Payment_Failed />
          </DashboardLayout>
        ),
      },
      {
        path: "experience",
        element: (
          <DashboardLayout>
            <Experience />
          </DashboardLayout>
        ),
      },

      {
        path: "update-experience",
        element: (
          <DashboardLayout>
            <Update_Experience />
          </DashboardLayout>
        ),
      },

      {
        path: "chat-with-avatar",
        element: (
          <DashboardLayout>
            <ChatWithAvatar />
          </DashboardLayout>
        ),
      },
      {
        path: "rate-tour/:id",
        element: (
          <DashboardLayout>
            <RateTour />
          </DashboardLayout>
        ),
      },
      {
        path: "rate-avathon/:id",
        element: (
          <DashboardLayout>
            <Avathonrate/>
          </DashboardLayout>
        ),
      },

      {
        path: "tip",
        element: (
          <DashboardLayout>
            <Tip />
          </DashboardLayout>
        ),
      },
      {
        path: "avttip",
        element: (
          <DashboardLayout>
            <Avathontip/>
          </DashboardLayout>
        ),
      },
      {
        path: "chat",
        element: (
          <DashboardLayout>
            <Chat />
          </DashboardLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <DashboardLayout>
            <EditProfile />
          </DashboardLayout>
        ),
      },
      {
        path: "privacy",
        element: (
          <DashboardLayout>
            <Privacy />
          </DashboardLayout>
        ),
      },
      {
        path: "terms",
        element: (
          <DashboardLayout>
            <Terms />
          </DashboardLayout>
        ),
      },
      {
        path: "terms",
        element: (
          <DashboardLayout>
            <Terms />
          </DashboardLayout>
        ),
      },
      {
        path: "instant-live",
        element: <InstantLive />,
      },
      {
        path: "explore-map",
        element: <ExploreMap />,
      },
      {
        path: "alltours",
        element: <Allmap />,
      },
      {
        path: "new-page",
        element: <NewPage />,
      },
      {
        path: "book-avathon/:id",
        element: (
          <DashboardLayout>
            <Book_Avathon_Details />
          </DashboardLayout>
        ),
      },
      // {
      //   path: "avathon-confirm-and-pay/:id",
      //   element: (
      //     <DashboardLayout>
      //       <AvathonConfirmPay />
      //     </DashboardLayout>
      //   ),
      // },
      {
        path: "avathon-confirm-and-pay",
        element: (
          <DashboardLayout>
            <AvathonConfirmPay />
          </DashboardLayout>
        ),
      },
    ],
  },
  {
    path: "/avatar",
    element: <AvatarProtected />,
    children: [
      {
        path: "dashboard",
        element: (
          <AvatarLayout>
            <AvtarHome />
          </AvatarLayout>
        ),
      },
      {
        path: "Bugreport",
        element: (
          <AvatarLayout>
            <ReportBug/>
            </AvatarLayout>
        ),
      },
      {
        path: "room_create/:id",
        element: <RoomCreate />,
        // element: <Root />,
      },
      {
        path: "avathon_create/:id",
        element: <AvathonCreate  />,
        // element: <Root />,
      },
      {
        path: "update-experience",
        element: (
          <DashboardLayout>
            <Update_Experience />
          </DashboardLayout>
        ),
      },

      {
        path: "notification",
        element: (
          <DashboardLayout>
            <Notification />
          </DashboardLayout>
        ),
      },
      {
        path: "experience",
        element: (
          <AvatarLayout>
            <ExperiencePage />
          </AvatarLayout>
        ),
      },
      {
        path: "offers/:id",
        element: (
          <AvatarLayout>
            <OffersPage />
          </AvatarLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <AvatarLayout>
            <Profile />
          </AvatarLayout>
        ),
      },
      {
        path: "edit-profile",
        element: (
          <AvatarLayout>
            <EditProfileAvatar />
          </AvatarLayout>
        ),
      },
      {
        path: "chat",
        element: (
          <AvatarLayout>
            <ChatPageAvatar />
          </AvatarLayout>
        ),
      },
      {
        path: "chatwithuser/:id",
        element: (
          <AvatarLayout>
            <ChatWithUser />
          </AvatarLayout>
        ),
      },
      {
        path: "bank",
        element: (
          <AvatarLayout>
            <BankAccountPage />
          </AvatarLayout>
        ),
      },
      {
        path: "stripe",
        element: (
          <AvatarLayout>
            <StripeAccountPage />
          </AvatarLayout>
        ),
      },
      {
        path: "paypal",
        element: (
          <AvatarLayout>
            <PaypalAccountPage />
          </AvatarLayout>
        ),
      },

      {
        path: "account-info",
        element: (
          <AvatarLayout>
            <AccountInfoPage />
          </AvatarLayout>
        ),
      },
      {
        path: "reports",
        element: (
          <AvatarLayout>
            <Reports />
          </AvatarLayout>
        ),
      },
      {
        path: "instant-cash",
        element: (
          <AvatarLayout>
            <InstantCashPage />
          </AvatarLayout>
        ),
      },
      {
        path: "add-experience",
        element: (
          <AvatarLayout>
            <AddNewExperiencePage />
          </AvatarLayout>
        ),
      },
      {
        path: "add-new-experience",
        element: (
          <AvatarLayout>
            <AddNewExperienceNewPage />
          </AvatarLayout>
        ),
      },
      {
        path: "experience-list",
        element: (
          <AvatarLayout>
            <MyExperienceList />
          </AvatarLayout>
        ),
      },
      {
        path: "privacy",
        element: (
          <AvatarLayout>
            <Privacy />
          </AvatarLayout>
        ),
      },
      {
        path: "terms",
        element: (
          <AvatarLayout>
            <Terms />
          </AvatarLayout>
        ),
      },

      {
        path: "edit-experience/:id",
        element: (
          <AvatarLayout>
            <EditExperiencePage />
          </AvatarLayout>
        ),
      },

      {
        path: "add-experience-image",
        element: (
          <AvatarLayout>
            <AddExperienceWithImagePage />
          </AvatarLayout>
        ),
      },
      {
        path: "create-avathons",
        element: (
          <AvatarLayout>
            <CreateNewAvathonsPage />
          </AvatarLayout>
        ),
      },
      {
        path: "add-avathons-image",
        element: (
          <AvatarLayout>
            <CreateAvathonsWithImagePage />
          </AvatarLayout>
        ),
      },
      {
        path: "edit-avathons/:id",
        element: (
          <AvatarLayout>
            <EditAvathonsPage />
          </AvatarLayout>
        ),
      },

      {
        path: "earnings",
        element: (
          <AvatarLayout>
            <EarningPage />
          </AvatarLayout>
        ),
      },
      {
        path: "performance",
        element: (
          <AvatarLayout>
            <PerformancePage />
          </AvatarLayout>
        ),
      },
      {
        path: "avatar-profile/:id",
        element: (
          <AvatarLayout>
            <AvatarProfile />
          </AvatarLayout>
        ),
      },
      {
        path: "check-out",
        element: (
          <AvatarLayout>
            <CheckOut />
          </AvatarLayout>
        ),
      },
      
    ],
  },
]);

export default router;

