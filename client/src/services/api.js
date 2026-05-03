import axios from "axios";

const BASE_URL =
     import.meta.env.VITE_API_URL ||
     "https://omniswap.onrender.com/api";

console.log("API URL:", BASE_URL);

const API = axios.create({
     baseURL: BASE_URL,
     withCredentials: true,
     timeout: 30000
});

API.interceptors.request.use(
     (req) => {
          try {
               const user = JSON.parse(localStorage.getItem("user"));

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
          console.log("API ERROR STATUS:", error.response?.status);
          console.log("API ERROR DATA:", error.response?.data);

          if (!error.response) {
               console.error("Network error / backend not reachable");
          }

          if (error.response?.status === 401) {
               const user = JSON.parse(localStorage.getItem("user"));

               if (user?.token) {
                    localStorage.removeItem("user");
                    window.location.href = "/login";
               }
          }

          return Promise.reject(error);
     }
);

export default API;