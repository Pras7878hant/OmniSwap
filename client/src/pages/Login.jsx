import { useState } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
     const { login } = useAuth();
     const navigate = useNavigate();

     const [form, setForm] = useState({
          email: "",
          password: ""
     });

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const res = await API.post("/auth/login", form);

               if (!res.data) {
                    alert("Login failed");
                    return;
               }

               login(res.data);

               navigate("/dashboard");

          } catch (error) {
               console.error(error);
               alert(error.response?.data || "Login failed");
          }
     };

     return (
          <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-950">

               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-black"></div>

               <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -top-40 -left-20 animate-pulse"></div>
               <div className="absolute w-[600px] h-[600px] bg-cyan-600/20 rounded-full blur-[120px] -bottom-40 -right-20 animate-pulse"></div>

               <form
                    onSubmit={handleSubmit}
                    className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md"
               >
                    <h2 className="text-4xl font-black mb-8 text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-purple-300">
                         Welcome Back
                    </h2>

                    <input
                         type="email"
                         placeholder="Email"
                         required
                         className="w-full mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                         onChange={(e) =>
                              setForm({ ...form, email: e.target.value })
                         }
                    />

                    <input
                         type="password"
                         placeholder="Password"
                         required
                         className="w-full mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none"
                         onChange={(e) =>
                              setForm({ ...form, password: e.target.value })
                         }
                    />

                    <button className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition">
                         Login
                    </button>
               </form>
          </div>
     );
};

export default Login;