import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "https://omniswap.onrender.com/api";


const API = axios.create({
     baseURL: BASE_URL,
     timeout: 30000
});

API.interceptors.request.use(
     (req) => {
          try {
               const token = localStorage.getItem("token");

               if (token) {
                    req.headers.Authorization = `Bearer ${token}`;
               }
          } catch (err) {
               console.log("Token extraction error:", err);
          }

          return req;
     },
     (error) => Promise.reject(error)
);

API.interceptors.response.use(
     (res) => {
          // console.log("API RESPONSE:", res.data);
          return res;
     },
     (error) => {
          const status = error.response?.status;
          // console.log("API ERROR STATUS:", status);
          // console.log("API ERROR DATA:", error.response?.data);

          if (!error.response) {
               console.error("Network error / backend not reachable");
          }

          return Promise.reject(error);
     }
);

export default API;