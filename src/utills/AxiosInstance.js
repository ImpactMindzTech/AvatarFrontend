import axios from "axios";
import { getLocalStorage } from "./LocalStorageUtills";

const axiosInstance = axios.create({
  // baseURL: `https://api.avatarwalk.com/`,
  //baseURL: `${import.meta.env.VITE_APP_VITEAPPLOCAL}/`,
  //baseURL: "https://backend-avatar-local.onrender.com/",
// baseURL:"http://localhost:3000/"
baseURL: "https://f6f0-2401-4900-1c6f-c113-a81f-6033-3c87-e688.ngrok-free.app/"


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
