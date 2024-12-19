import RecentCompleteTourCard from "@/components/Avatar/Card/RecentCompleteTourCard";
import { EarningChart } from "@/components/Avatar/Chart/EarningChart";
import HeaderBack from "@/components/HeaderBack";
import Loader from "@/components/Loader";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import {
  avatarEarningApi,
  fetchPaypalApi,

  fetchstripeApi,
  withdrawAmountApi,
  withdrawpaypal,
} from "@/utills/service/avtarService/Earnings";
import { experienceGetrequestsApi } from "@/utills/service/experienceService/ExperienceService";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import Images from "@/constant/Images";

function EarningPage() {
  const [amountDetail, setAmountDetails] = useState(null);
  const [CompleteExperince, setCompleteExperince] = useState([]);
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState("");
  const [withdraw, setWithdraw] = useState(""); // State for the withdrawal amount
  const [error, setError] = useState(""); // State for validation error
const[showoption,setoption] = useState(false);
const [selectedAccount, setSelectedAccount] = useState("")
  const handleInputChange = (e) => {
    setoption(true);
    setWithdraw(e.target.value); // Update the state with the new value
    setError(""); // Clear error message on input change
    if(e.target.value==0){
      setoption(false);
    }
  };
  const handleAccountChange = (e) => {
    setSelectedAccount(e.target.value);
  };
console.log(selectedAccount);

  const fetchstripe = async () => {
    try {
      if (selectedAccount === "stripe") {
        const res = await fetchstripeApi(); // Replace with actual fetch call
        if (res?.isSuccess) {
          setEmail(res?.data?.stripeEmail);
        }
      } else if (selectedAccount === "paypal") {
        const res = await fetchPaypalApi(); // Replace with actual fetch call
        if (res?.isSuccess) {
          setEmail(res?.data?.paypalEmail);
        }
      }
    } catch (error) {
      console.error("Error fetching account email:", error);
    }
  };
 
  const avatarEarning = async () => {
    try {
      const response = await avatarEarningApi();
      setAmountDetails(response);
    } catch (error) {
      console.log(error);
    }
  };

  const withdrawAmount = async() => {
    const body = {
      StripeEmail: email,
      amount: withdraw || 0,
      method:selectedAccount
    };

    try {
      if (!withdraw || isNaN(withdraw) || withdraw <= 0) {
        setoption(false);
        setError("Please Enter a  valid amount.");
        return;
      }
      if(selectedAccount==="stripe"){

        const response = await withdrawAmountApi(body);
  
       if(response?.success){
        toast.success("Withdrawal successful! Funds have been transferred")
       }

      }
      else if(selectedAccount==="paypal"){
        const response = await withdrawpaypal(body);
        if(response?.success){
          toast.success("Withdrawal successful! Funds have been transferred")
         }
      }
    } catch (error) {
      toast.error("Error: Please ensure your Stripe email is added");
    }
    avatarEarning();
  };

  const experienceGetrequests = async () => {
    const status = "Completed";
    try {
      setLoader(true);
      const response = await experienceGetrequestsApi(status);
      if (response?.isSuccess) {
        setCompleteExperince(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    
    experienceGetrequests();
    avatarEarning();
    if(selectedAccount){
      fetchstripe();
    }
  
  }, [selectedAccount]);

  return (
    <>
      {loader && <Loader />}
      <div className="px-4">
        <HeaderBack link="/avatar/profile" text={"Your Earnings"} />
        <p className="flex items-center mt-2">
  <div className="flex items-center justify-between w-full">
  <div className="flex">
  <img src={Images.info} alt="Info icon" className="w-5 h-5 mr-2" />
  <span className="text-gray-500 text-sm sm:text-xs">A minimum of $50 is required to make a withdrawal.</span>
  </div>
 <div className="flex">
 <p className="me-2"><b>Paypal Balance: {amountDetail?.paypal?.balance ?amountDetail?.paypal?.balance:0}</b> </p>
 <p><b>Stripe Balance: {amountDetail?.stripe?.balance? amountDetail?.stripe?.balance:0}</b></p>
 </div>
  </div>
</p>

        <div
          className="flex justify-between items-center mt-4 p-3 rounded-lg border border-slate-200 mb-6"
          style={{ boxShadow: "0 0 8px rgba(0,0,0,.08)" }}
        >
          <form >
          <div className="flex items-center left">
        <span className="text-grey-900 text-2xl font-bold">{getCurrencySymbol()}</span>

        <input
          type="number"
          value={withdraw}
          onChange={handleInputChange}
          className="ml-2 p-2 rounded-mdtext-grey-900 text-2xl font-bold  focus:outline-none focus:ring-2 focus:ring-transparent placeholder-gray-400"
          min="0"
          step="any"
          placeholder="Enter amount"
        />
       {showoption&& withdraw >50 &&(
         <div className="">
       
        
         <label className="inline-flex items-center mr-6">
           <input
             type="radio"
             value="stripe"
             checked={selectedAccount === "stripe"}
             onChange={handleAccountChange}
             className="form-radio text-blue-500"
           />
           <span className="ml-2 text-grey-900">Stripe</span>
         </label>
         
         <label className="inline-flex items-center">
           <input
             type="radio"
             value="paypal"
             checked={selectedAccount === "paypal"}
             onChange={handleAccountChange}
             className="form-radio text-blue-500"
           />
           <span className="ml-2 text-grey-900">PayPal</span>
         </label>
       </div>
       )}
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      
      </form>
          <div className="right" onClick={withdrawAmount}>
         
          <button
  disabled={withdraw<= 50}
  className={`rounded-md px-8 py-4 font-bold sm:py-2 sm:px-6 lg:py-3 lg:px-7 ${
    withdraw <= 50 ? 'bg-gray-400 cursor-not-allowed' : 'bg-grey-900 cursor-pointer'
  } text-white`}
>
  Withdraw
</button>

         
          </div>
        </div>

        <div className="chart my-8">
          <EarningChart />
        </div>
        <div className="bg-[#F9F9F9] p-4 rounded-lg">
          <div className="text-center my-2 bg-[#ffffff] p-3 rounded-lg mb-4 relative">
            <img
              src={Images.pattern}
              alt="pattern"
              className="absolute bottom-0 right-0"
            />
            <img
              src={Images.pattern}
              alt="pattern"
              className="absolute top-0 left-0 rotate-180"
            />
            <h1>
              {getCurrencySymbol()}
              {amountDetail?.totalEarnings ? amountDetail?.totalEarnings : 0}
            </h1>
            <p>Total Earnings</p>
          </div>
          <div className="anatical">
            <h1 className="sm:text-lg">Analytics</h1>
            <div className="flex justify-between items-center my-2">
              <p>Earnings in (This Month)</p>
              <h1 className="sm:text-base">
                {getCurrencySymbol()}
                {amountDetail?.thisMonthEarnings
                  ? amountDetail?.thisMonthEarnings
                  : 0}
              </h1>
            </div>
            {/* <div className="flex justify-between items-center my-2">
          <p>Upcoming Experience</p>
          <h1 className="sm:text-base">{getCurrencySymbol()}00.00</h1>
        </div> */}
            <div className="flex justify-between items-center my-2">
              <p>Completed Tours</p>
              <h1 className="sm:text-base">
                {amountDetail?.completedTours
                  ? amountDetail?.completedTours
                  : 0}
              </h1>
            </div>
            {/* <div className="flex justify-between items-center my-2">
          <p>Average Experience Charges</p>
          <h1 className="sm:text-base">{getCurrencySymbol()}05.00</h1>
        </div> */}
            <div className="flex justify-between items-center my-2">
              <p>Available for Withdraw</p>
              <h1 className="sm:text-base">
                {getCurrencySymbol()}
                {amountDetail?.totalEarnings ? amountDetail?.totalEarnings : 0}
              </h1>
            </div>
          </div>

          <div className="mt-6">
            <h1 className="sm:text-lg">Revenue</h1>
            {/* <div className="flex justify-between items-center my-2">
          <p>Earning Till Date</p>
          <h1 className="sm:text-base">{getCurrencySymbol()}38000</h1>
        </div> */}
            <div className="flex justify-between items-center my-2">
              <p>Today’s Earning</p>
              <h1 className="sm:text-base">
                {getCurrencySymbol()}
                {amountDetail?.todayEarnings ? amountDetail?.todayEarnings : 0}
              </h1>
            </div>
          </div>
        </div>

        <div className="my-9">
          <h1>Recent Completed Tours</h1>
          {CompleteExperince.length !== 0 ? (
            <>
              <div className="my-5 grid grid-cols-4 2xl:grid-cols-3  lg:grid-cols-2 sm:grid-cols-1 xl:grid-cols-2 gap-4">
                {CompleteExperince.map((item) => {
                  return <RecentCompleteTourCard data={item} key={item._id} />;
                })}
              </div>
            </>
          ) : (
            <h1>No Recent Completed Tours</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default EarningPage;