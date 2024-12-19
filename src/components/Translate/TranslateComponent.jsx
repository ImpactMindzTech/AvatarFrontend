import React, { useEffect } from 'react'

const TranslateComponent = () => {
    const googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            autoDisplay: false
          },
          "google_translate_element"
        );
      };
      useEffect(() => {
        var addScript = document.createElement("script");
        addScript.setAttribute(
          "src",
          "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        );
        document.body.appendChild(addScript);
        window.googleTranslateElementInit = googleTranslateElementInit;
      }, []);
  return (
    // <div id="google_translate_element" style={{ display: "none" }}></div>
    <div id="google_translate_element" ></div>
  )
}

export default TranslateComponent


// import React, { useEffect, useRef } from 'react'

// const TranslateComponent = () => {
//     const googleTranslateRef=useRef(null);
//     useEffect(()=>{
//         let intervalId;

//         const checkGoogleTranslate=()=>{
//             if(window.google && window.google.translate){
//                 clearInterval(intervalId);
//                 new window.google.translate.TranslateElement(          
//                     {
//                     pageLanguage: "en",
//                     layout:window.google.translate.TranslateElement.InlineLayout.SIMPLE
//                   },
//                   googleTranslateRef.current
//                 );
//             }
//         }
//         intervalId=setInterval(checkGoogleTranslate,100)
//     },[])
//   return (
//     <div>
//       <div ref={googleTranslateRef}></div>
//     </div>
//   )
// }

// export default TranslateComponent
