import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setProducts } from "@/store/slice/experinceS/ExperinceSlice";
import FilterUserCard from "../Cards/FilterCard/FilerUserCard";
import UserSearch from "../UserTopSearch/UserSearch";
import Loader from "../Loader";
import { getLocalStorage } from "@/utills/LocalStorageUtills";
import { userfilteredExp } from "@/utills/service/userSideService/userService/UserHomeService";
import InfiniteScroll from "react-infinite-scroll-component";
import { FadeLoader } from "react-spinners";

const FilterMenu = () => {
  const [activeTab, setActiveTab] = useState("All");
  const tabs = {
    All: "All",
    Place: "By Name",
    City: "City",
    State: "State",
    Country: "Country",
  };

  const [itemsPerPage] = useState(16); // Fixed items per page
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [localData, setLocalData] = useState([]);
  const dispatch = useDispatch();
  const userExperienceData = useSelector(
    (state) => state.ExperinceProduct.products
  );

  const fetchUserExperience = useCallback(
    async (tab, page) => {
      const payload = {
        tab,
        search,
        page,
        items_per_page: itemsPerPage,
      };
      setLoading(true);
      try {
        const response = await userfilteredExp(payload);
        const userId = getLocalStorage("user")?._id;

        if (response?.isSuccess) {
          const newData = response.data.filter(
            (item) => item.availabilities.length !== 0
          );
          const filterNotMyData = newData.filter(
            (item) => item.avatarId !== userId
          );

          setLocalData((prevData) => {
            const mergedData = [...prevData, ...filterNotMyData];
            const uniqueData = Array.from(
              new Map(mergedData.map((item) => [item._id, item])).values()
            );
            return uniqueData;
          });

          // Update total pages based on API response
          setTotalPages(response.totalPages || 1);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [search, itemsPerPage]
  );

  useEffect(() => {
    setLocalData([]); // Clear data when switching tabs
    setCurrentPage(1); // Reset to page 1
    fetchUserExperience(activeTab, 1); // Fetch data for the new tab
  }, [activeTab, fetchUserExperience]);

  const fetchMoreData = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      fetchUserExperience(activeTab, nextPage);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div>
        <UserSearch onsearch={setSearch} />
        <div className="lg:overflow-x-auto lg:overflow-y-hidden">
          <div className="flex gap-2">
            {Object.keys(tabs).map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 whitespace-nowrap rounded border border-[#cccccc] ${
                  activeTab === tab
                    ? "bg-backgroundFill-900 border-[#cccccc] text-white"
                    : "bg-white text-grey-800"
                } hover:bg-backgroundFill-900 hover:border-[#cccccc] hover:text-white`}
                onClick={() => setActiveTab(tab)}
              >
                {tabs[tab]}
              </button>
            ))}
          </div>
        </div>

        <InfiniteScroll
          dataLength={localData?.length || 0}
          next={fetchMoreData}
          hasMore={currentPage < totalPages}
          className="px-4"
          loader={
            <div className="flex justify-center py-4 overflow-hidden">
              <FadeLoader color="#000" height={5} width={5} />
            </div>
          }
        >
          <div className="my-5 grid grid-cols-4 2xl:grid-cols-3 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {localData?.length !== 0 ? (
              localData.map((product) => (
                <FilterUserCard key={product._id} product={product} />
              ))
            ) : (
              <h1 className="font-medium text-sm">No Data Found</h1>
            )}
          </div>
        </InfiniteScroll>

        {currentPage >= totalPages && (
          <div className="text-center text-gray-500 py-4">
            No more data to load
          </div>
        )}
      </div>
    </>
  );
};

export default FilterMenu;
