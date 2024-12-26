import axios from "axios";
import { getLocalStorage } from "./LocalStorageUtills";

const axiosInstance = axios.create({
   baseURL: `https://api.avatarwalk.com/`,
  //baseURL: `${import.meta.env.VITE_APP_VITEAPPLOCAL}/`,
  //baseURL: "https://backend-avatar-local.onrender.com/",
//baseURL:"http://localhost:3000/"
 //baseURL: "https://avatarbackend-4v41.onrender.com/"


});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = getLocalStorage("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    
    return Promise.reject(error);
  }
);

export default axiosInstance;
