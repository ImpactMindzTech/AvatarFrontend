// socket.js
import { io } from "socket.io-client";
import { getLocalStorage } from "@/utills/LocalStorageUtills";



let userId = getLocalStorage("user")?._id;




const socket = io(`https://api.avatarwalk.com/`, {
//const socket = io(`http://localhost:3000/`, {
  withCredentials: true,
  query: {user:userId},
  reconnectionAttempts: 5, 
  transports: ['websocket'],
  secure: true, 
  reconnectionDelay: 1000,   // Start with 1 second delay
  reconnectionDelayMax: 5000, 
  autoConnect: true
});
socket.on("connect", () => {
  console.log(`Connected to server `);
});
socket.connect();

export default socket;






