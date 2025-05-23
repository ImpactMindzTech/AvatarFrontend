import Images from "@/constant/Images";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long" };
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", options);
};

const SeeAllReviewCard = ({ review }) => {

  const { userName, createdAt, rating, comment, language,userImage  } = review;
  return (
    <div className="review-card">
      {/* Top section */}
      <div className="flex gap-2 items-start mt-8">
        <div className="userImg">
          <img src={userImage} alt="user" className="w-10 h-10 " />
        </div>
        <div className="flex flex-col">
          <h3 className="font-medium text-grey-800 text-lg leading-none">
            {userName}
          </h3>
          <p className="text-grey-800 text-xs mt-2">{formatDate(createdAt)}</p>
        </div>
      </div>
      {/* Star rating */}
      <div className="star">
        <Stack spacing={1}>
          <Rating name="half-rating" value={rating} precision={0.5} readOnly />
        </Stack>
      </div>
      <div className="detail">
        <h1 className="font-normal sm:text-base">{comment}</h1>

        <div className="flex items-center gap-3 mt-2">
          {language && (
            <div className="flex gap-1 items-center">
              <img src={userImage} alt="translate" className="w-5 h-5" />
              <div className="text-grey-800 lg:text-sm">
                Translate from {language}
              </div>
            </div>
          )}
          {/* <div className="lang-switcher flex flex-wrap gap-3 sm:text-xs">
            <img src={Images.iconTranslate} alt="" />
            <button type="button" className="main-link text-grey-800" disabled>
              Translate from spanish
            </button>
            <button type="button" className="main-link underline">
              Show Original
            </button>
          </div> */}
          {/* <div className="underline underline-offset-4 lg:text-sm cursor-pointer">
            Show Original
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default SeeAllReviewCard;
