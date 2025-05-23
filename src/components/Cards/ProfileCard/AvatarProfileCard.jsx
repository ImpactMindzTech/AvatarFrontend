
import Images from "@/constant/Images";


export default function AvatarProfileCard({ avatardetail }) {
// console.log(avatardetail);
  const calculateAverageRating = (reviews) => {

    if (reviews?.length > 0) {
      const totalRating = reviews.reduce(
        (acc, review) => acc + review.rating,
        0
      );
      return (totalRating / reviews.length).toFixed(1);
    }
    return 0;
  };

   
  const averageRating = calculateAverageRating(avatardetail?.Reviews);
  const userAtThisPlatformFrom = avatardetail?.year?.split(" ");

  return (
    <div className="my-0 mt-6 ">
      <div className="flex items-center">
        <div className="w-[150px] sm:w-[100px]">
          <img
            src={avatardetail?.avatarImage || Images.imagePlaceholder}
            alt="avatarProfile"
            className="w-full rounded-full aspect-square"
          />
        </div>
        <div className="flex w-[calc(100%-150px)] sm:w-[calc(100%-60px)]">
          <div className=" flex-1 text-center ml-[50px] sm:ml-[20px]">
            <h1 className="text-grey-900 text-2xl sm:text-sm">
              {avatardetail?.total_items}
            </h1>
            <p className="text-xl sm:text-sm text-slate-500">Experience</p>
          </div>

          <div className="text-center ml-[50px] sm:ml-[20px]">
            <h1 className="flex-1 text-grey-900 text-2xl flex justify-center gap-2 sm:text-sm">
              {averageRating}
              <img src={Images.star2} alt="star" className="sm:w-[12px]" />
            </h1>
            <p className="text-xl sm:text-sm text-slate-500">Ratings</p>
          </div>

          <div className=" flex-1 text-center ml-[50px] sm:ml-[20px]">
            <h1 className="text-grey-900 text-2xl flex justify-center gap-2 sm:text-sm">
              {userAtThisPlatformFrom && userAtThisPlatformFrom[0] > 0
                ? userAtThisPlatformFrom[0]
                : "1"}
            </h1>
            <p className="text-xl sm:text-sm text-slate-500 capitalize">
              {userAtThisPlatformFrom && userAtThisPlatformFrom[1]}
            </p>
          </div>
        </div>
      </div>
      <h1 className="text-grey-900 mt-3 sm:text-lg ">
        {avatardetail?.userName}
      </h1>
     <div className="flex items-center gap-3 mt-1">
     
     <p className="text-grey-800">{avatardetail?.State},{avatardetail?.Country}</p>
     </div>
      <p className="text-grey-900">
        <span className="text-grey-800">{avatardetail?.about}</span>
      </p>
      
    </div>
  );
}
