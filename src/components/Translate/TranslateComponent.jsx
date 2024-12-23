import React, { useEffect } from "react";
import '../Translate/TranslateComponent.css'

const TranslateComponent = () => {
  const googleTranslateElementInit = () => {
    new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        autoDisplay: false,
      },
      "google_translate_element"
    );
  };

  useEffect(() => {
    // Prevent multiple script loads
    if (!document.getElementById("google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.setAttribute(
        "src",
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
      );
      addScript.id = "google-translate-script";
      document.body.appendChild(addScript);
      window.googleTranslateElementInit = googleTranslateElementInit;
    }
  
  
  }, []);

  return (
    <div>
      <div id="google_translate_element"></div>
    </div>
  );
};

export default TranslateComponent;

