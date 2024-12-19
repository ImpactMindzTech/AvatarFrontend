// // import React from 'react'

// // const CheckOut = () => {
// //   return (
// //     <div className='container border-2 border-black'>
      
// //     </div>
// //   )
// // }

// // export default CheckOut


// import React, { useState } from "react";

// const CheckOut = () => {
//   const [checkedItems, setCheckedItems] = useState([]);

//   const checklist = [
//     {
//       id: 1,
//       title: "Clean Your Equipment",
//       description:
//         "Wipe the lenses of your camera to ensure a clear, high-quality video for your clients.",
//       icon: "✨",
//     },
//     {
//       id: 2,
//       title: "Check Your Connection",
//       description:
//         "Are you in a high-service area, or are you connected to a stable Wi-Fi network?",
//       icon: "📶",
//     },
//     {
//       id: 3,
//       title: "Verify Camera Access",
//       description:
//         "Ensure your browser (Safari or Chrome) has camera & microphone permissions enabled.",
//       icon: "📷",
//     },
//     {
//       id: 4,
//       title: "Test Your Audio Setup",
//       description:
//         "Avoid using headsets or any accessories that might block your phone’s microphone or speakers.\nConfirm that your phone’s speakers and mic are clear and unobstructed.",
//       icon: "🔊",
//     },
//     {
//       id: 5,
//       title: "Final Pre-Check",
//       description:
//         "Double-check everything before going live to provide the best experience for your client! This checklist will help ensure a smooth and professional live streaming session.",
//       icon: "✅",
//     },
//   ];

//   const toggleCheck = (id) => {
//     setCheckedItems((prev) =>
//       prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//     );
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-6 font-sans">
//       {/* Header */}
//       <div className="flex items-center space-x-4 mb-6">
//         <button className="text-2xl">&larr;</button>
//         <h1 className="text-2xl font-bold text-gray-900">
//           Checklist for Avatars
//         </h1>
//       </div>

//       {/* Checklist Items */}
//       <div className="space-y-4">
//         {checklist.map((item) => (
//           <div
//             key={item.id}
//             className="flex items-start p-4 bg-white shadow rounded-lg relative"
//           >
//             {/* Icon */}
//             <span className="text-2xl absolute top-4 left-4">{item.icon}</span>
//             {/* Content */}
//             <div className="pl-10 flex-1">
//               <h2 className="font-bold text-gray-800 mb-1">{item.title}</h2>
//               <p className="text-gray-600 text-sm whitespace-pre-line">
//                 {item.description}
//               </p>
//             </div>
//             {/* Checkbox */}
//             <input
//               type="checkbox"
//               className="w-6 h-6 rounded border-gray-300 text-blue-500 focus:ring-blue-400"
//               checked={checkedItems.includes(item.id)}
//               onChange={() => toggleCheck(item.id)}
//             />
//           </div>
//         ))}
//       </div>

//       {/* Done Button */}
//       <div className="mt-6">
//         <button
//           className="w-full bg-black text-white py-3 text-lg font-semibold rounded-lg hover:bg-gray-800"
//           onClick={() => alert("Checklist Completed!")}
//         >
//           Done
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CheckOut;


// import React from 'react'

// const CheckOut = () => {
//   return (
//     <div className='container border-2 border-black'>
      
//     </div>
//   )
// }

// export default CheckOut


import HeaderBack from "@/components/HeaderBack";
import React, { useState } from "react";
// import './CheckOut.css'

const CheckOut = () => {
  const [checkedItems, setCheckedItems] = useState([]);

  const checklist = [
    {
      id: 1,
      title: "Clean Your Equipment",
      description:
        "Wipe the lenses of your camera to ensure a clear, high-quality video for your clients.",
      icon: "✨",
    },
    {
      id: 2,
      title: "Check Your Connection",
      description:
        "Are you in a high-service area, or are you connected to a stable Wi-Fi network?",
      icon: "📶",
    },
    {
      id: 3,
      title: "Verify Camera Access",
      description:
        "Ensure your browser (Safari or Chrome) has camera & microphone permissions enabled.",
      icon: "📷",
    },
    {
      id: 4,
      title: "Test Your Audio Setup",
      description:
        "Avoid using headsets or any accessories that might block your phone’s microphone or speakers.\nConfirm that your phone’s speakers and mic are clear and unobstructed.",
      icon: "🔊",
    },
    {
      id: 5,
      title: "Final Pre-Check",
      description:
        "Double-check everything before going live to provide the best experience for your client! This checklist will help ensure a smooth and professional live streaming session.",
      icon: "✅",
    },
  ];

  const toggleCheck = (id) => {
    setCheckedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen p-6 font-sans">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <HeaderBack />
        <h1 className="text-xl font-bold text-[#3A3A3A]">
          Checklist for Avatars
        </h1>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklist.map((item) => (
          <div
            key={item.id}
            // className="flex items-start p-4 bg-white shadow rounded-lg relative"
            className="flex items-start p-4 px-6 bg-white  rounded-xl relative border-2 border-[#F4F4F4]"
          >
            {/* Icon */}
            <div className="absolute top-4 left-4 bg-[#F4F4F4] w-[40px] h-[40px] rounded-[20px] flex justify-center items-center">
              {item.icon}
            </div>
            {/* Content */}
            <div className="pl-10 flex-1">
              <h2 className="font-bold text-[#3A3A3A] mb-1">{item.title}</h2>
              <p className="text-[#8A8A8A] text-[16px] font-normal whitespace-pre-line pr-2 ">
                {item.description}
              </p>
            </div>
            {/* Checkbox */}
            <div className="custom-check-checkout mt-2">
                <input type="checkbox" className=""  checked={checkedItems.includes(item.id)}
              onChange={() => toggleCheck(item.id)}/>
                <div></div>
              </div>
            
          </div>
        ))}
      </div>

      {/* Done Button */}
      <div className="mt-6">
        <button
          className="w-full bg-primaryColor-900 text-white py-3 text-lg font-semibold rounded-lg hover:bg-gray-800"
          onClick={() => alert("Checklist Completed!")}
        >
          Done
        </button>
      </div>
    </div>
  );
};

export default CheckOut;
