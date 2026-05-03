import axios from "axios";

const BASE_URL =
     import.meta.env.VITE_API_URL ||
     "https://omniswap.onrender.com/api";

console.log("API URL:", BASE_URL);

const API = axios.create({
     baseURL: BASE_URL,
     timeout: 30000
});

API.interceptors.request.use(
     (req) => {
          try {
               const raw = localStorage.getItem("user");
               const user = raw ? JSON.parse(raw) : null;

               console.log("TOKEN IN REQUEST:", user?.token);

               if (user?.token) {
                    req.headers.Authorization = `Bearer ${user.token}`;
               }
          } catch (err) {
               console.log("Token parse error:", err);
          }

          return req;
     },
     (error) => Promise.reject(error)
);

API.interceptors.response.use(
     (res) => {
          console.log("API RESPONSE:", res.data);
          return res;
     },
     (error) => {
          const status = error.response?.status;

          console.log("API ERROR STATUS:", status);
          console.log("API ERROR DATA:", error.response?.data);

          if (!error.response) {
               console.error("Network error / backend not reachable");
          }

          // ❌ REMOVE AUTO LOGOUT
          // DO NOT delete token here

          return Promise.reject(error);
     }
);

export default API;