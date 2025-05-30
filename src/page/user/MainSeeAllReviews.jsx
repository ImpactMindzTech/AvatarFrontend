import { useEffect, useState } from "react";
import SeeAllReview from "@/components/Cards/SeeAllReview/SeeAllReview";
import SeeAllReviewCard from "@/components/Cards/SeeAllReviewCard/SeeAllReviewCard";
import HeaderBack from "@/components/HeaderBack";
import Images from "@/constant/Images";
import { mainExperienceListApi } from "@/utills/service/userSideService/userService/UserHomeService";
import { useParams } from "react-router-dom";
import Loader from "@/components/Loader";

function MainSeeAllReviews() {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("Most recent"); 
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const response = await mainExperienceListApi(id);
        if (response?.isSuccess) {
          const fetchedReviews =
            response?.data?.experiences?.flatMap((exp) => exp.Reviews) || [];
         
          const sortedReviews = [...fetchedReviews].sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortOrder === "Most recent" ? dateB - dateA : dateA - dateB;
          });
          setReviews(sortedReviews);
        } else {
          setError("Failed to fetch reviews");
        }
      } catch (err) {
        setError("An error occurred while fetching reviews");
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [id, sortOrder]); 

  const handleSortChange = (event) => {
    const value = event.target.value;
    setSortOrder(value);
   
    const sortedReviews = [...reviews].sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      return value === "Most recent" ? dateB - dateA : dateA - dateB;
    });
    setReviews(sortedReviews);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  
  const filteredReviews = reviews.filter((review) =>
    review.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateOverallRating = (reviews) => {

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };

  
    reviews.forEach((review) => {
      const rating = Math.round(review.rating); 
      if (ratingCounts[rating] !== undefined) {
        ratingCounts[rating] += 1;
      }
    });

    return ratingCounts;
  };

  return (
    <>
      {loading && <Loader />}
      <div className="container">
        <HeaderBack
          link="/user/book-experience"
          text={`Reviews (${(
            reviews.reduce((sum, review) => sum + review.rating, 0) /
            reviews.length
          ).toFixed(1)})`}
        />

        <div className="my-4">
   
          <SeeAllReview
            overallRating={calculateOverallRating(reviews)}
            cleanlinessRating={4.5} 
            accuracyRating={4.6} 
          />

       
          <div className="flex justify-between my-5 items-center">
            <div className="font-bold text-grey-900">
              {reviews.length} reviews
            </div>
            <div className="border rounded-md px-3 py-1">
              <select
                value={sortOrder}
                onChange={handleSortChange}
                className="text-grey-800 outline-none lg:text-md"
              >
                <option value="Most recent">Most recent</option>
                <option value="oldest">oldest</option>
              </select>
            </div>
          </div>

       
          <div className="flex items-center w-full my-5">
            <div className="relative w-full">
              <div className="flex absolute top-1 left-3 p-2.5 rounded-full">
                <img src={Images.searchGray} alt="searchGray Icon" />
              </div>
              <input
                type="search"
                name="search bar"
                id="search bar"
                value={searchTerm}
                onChange={handleSearchChange}
                className="inputRounded2 rounded-full"
                placeholder="Search..."
              />
            </div>
          </div>

        
          <div className="reviewBox">
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : (
              filteredReviews?.map((review) => (
                <SeeAllReviewCard key={review._id} review={review} />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainSeeAllReviews;
