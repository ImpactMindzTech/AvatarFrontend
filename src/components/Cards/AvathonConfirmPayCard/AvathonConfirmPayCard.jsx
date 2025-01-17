import Images from "@/constant/Images";

const AvathonConfirmPayCard = ({ details }) => {


 
  const thumbnail = details?.avathonsThumbnail;



  return (
    <div className="flex  gap-1 w-full BoxShadowLessRounded p-2 lg:flex-wrap lg:mb-5">
      <div className="sm:h-auto md:h-[130px] lg:h-[150px] sm:w-[30%] h-[180px] w-[20%]">
      {thumbnail==" "?<img className="w-[100%] h-[100%] object-cover rounded-2xl" src={details?.avathonsImage[0]}></img>:<video
                    src={thumbnail}
                  autoPlay
                  loop
                    className="w-[100%] rounded-md"
                  />}
        {/* <video
          src={thumbnail}
          alt="card image"
          className="w-[100%] h-[100%] object-cover rounded-md"
        /> */}
      </div>
      <div className="textRight pt-4 flex-1 px-4 sm:px-2 sm:py-0">
        <h1 className="font-bold text-grey-900 sm:text-base line-clamp-2">
          {details?.avathonTitle}{" "}
          {details?.Country}
        </h1>
        <div className="flex items-start gap-2 pt-2">
          <img
            src={Images.location2}
            alt="location2"
            className="rounded-full sm:w-[14px] mt-[4px]"
          />
          <p className="sm:text-xs">
            {details?.State &&
              details?.State + ", "}{" "}
            {details?.City}
          </p>
        </div>

        
      </div>
    </div>
  );
};

export default AvathonConfirmPayCard;
