import axios from "axios";

const API = axios.create({
     baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
     withCredentials: true,
     timeout: 10000
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
          console.log("API ERROR:", error.response?.data);

          if (error.response?.status === 401) {
               localStorage.removeItem("user");
               window.location.href = "/login";
          }

          return Promise.reject(error);
     }
);

export default API;