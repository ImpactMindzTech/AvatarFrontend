const PerformanceCard = ({ item }) => {

  return (
    <div className="bg-backgroundFill-900 text-center p-4 rounded-xl relative sm:p-2">
  
      <h1 className="text-white">{isNaN(item.info)?0:item.info}</h1>
      <p className="text-grey-800 sm:leading-5 sm:text-xs">{item.name}</p>
    </div>
  );
};

export default PerformanceCard;
