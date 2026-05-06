import { io } from "socket.io-client";

const BASE_URL =
     import.meta.env.VITE_API_URL?.replace("/api", "") ||
     "https://omniswap.onrender.com";

export const socket = io(BASE_URL, {
     withCredentials: true,
     autoConnect: true
});
