import axios from "axios";

const API = axios.create({
     baseURL: "http://localhost:5000/api"
});

API.interceptors.request.use((req) => {
     const user = JSON.parse(localStorage.getItem("user"));

     if (user?.token) {
          req.headers.Authorization = `Bearer ${user.token}`;
     }

     return req;
});

API.interceptors.response.use(
     (res) => res,
     (error) => {
          if (error.response?.status === 401) {
               localStorage.removeItem("user");
               window.location.href = "/login";
          }
          return Promise.reject(error);
     }
);

export default API;