import Images from "@/constant/Images";
import { getCurrencySymbol } from "@/constant/CurrencySign";
import { useNavigate } from "react-router-dom";


export default function EarningCard({ icon, price, title }) {
  let navigate = useNavigate();
  const handleclick = ()=>{ 
    navigate("/avatar/earnings")
  }
  return (


    <>
 
 <div onClick={handleclick} className="cursor-pointer expShadow w-[20%]  2xl:w-[40%] lg:w-[50%] p-4 relative overflow-hidden">
      <div className="flex  items-center justify-between">
        <div className="left">
          <div  className=" bg-grey-300 rounded-sm p-1">
            <img src={icon} alt={icon} className="max-w-[30px]" />
          </div>
        </div>
        <div  className="  flex-1  flex justify-end">
          <img src={Images.arrow_right} alt="" />
        </div>
      </div>
      <h1 className="pt-2 text-grey-900 text-2xl">
        {getCurrencySymbol()}
        {price}
      </h1>
      <p className="text-grey-800">{title}</p>{" "}
      <div className="absolute bottom-0 right-0">
        <img src={Images.pattern} alt="pattern" />
      </div>
    </div>

    </>

  );
}
