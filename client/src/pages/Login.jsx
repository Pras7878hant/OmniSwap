import { useState } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Login = () => {
     const { login } = useAuth();
     const navigate = useNavigate();
     const [view, setView] = useState("login");
     const [form, setForm] = useState({ email: "", password: "", otp: "", newPassword: "" });

     const handleLogin = async (e) => {
          e.preventDefault();

          try {
               const res = await API.post("/auth/login", { email: form.email, password: form.password });

               localStorage.setItem("token", res.data.token);
               localStorage.setItem("user", JSON.stringify(res.data.user));
               login(res.data.user);

               navigate("/dashboard");
          } catch (error) {
               alert(error.response?.data?.message || "Login failed");
          }
     };

     const handleRequestResetOTP = async (e) => {
          e.preventDefault();
          try {
               await API.post("/auth/request-otp", { email: form.email, type: "reset" });
               setView("reset");
          } catch (error) {
               alert(error.response?.data?.message || "User not found");
          }
     };

     const handleResetPassword = async (e) => {
          e.preventDefault();
          try {
               await API.post("/auth/reset-password", form);
               alert("Password reset successful! Please login.");
               setView("login");
          } catch (error) {
               alert(error.response?.data?.message || "Invalid OTP");
          }
     };

     return (
          <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-950">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-black"></div>
               <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -top-40 -left-20 animate-pulse"></div>

               <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">

                    {view === "login" && (
                         <form onSubmit={handleLogin}>
                              <h2 className="text-4xl font-black mb-8 text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-purple-300">Welcome Back</h2>
                              <input type="email" placeholder="Email" required className="w-full mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                              <input type="password" placeholder="Password" required className="w-full mb-2 p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, password: e.target.value })} />

                              <button type="button" onClick={() => setView("forgot")} className="text-indigo-400 text-sm mb-6 hover:text-indigo-300 w-full text-right">Forgot Password?</button>

                              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition">Login</button>
                         </form>
                    )}

                    {view === "forgot" && (
                         <form onSubmit={handleRequestResetOTP}>
                              <h2 className="text-2xl font-black mb-4 text-center text-white">Reset Password</h2>
                              <p className="text-sm text-slate-300 mb-6 text-center">Enter your email to receive a recovery code.</p>
                              <input type="email" placeholder="Account Email" required className="w-full mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition">Send Code</button>
                              <button type="button" onClick={() => setView("login")} className="mt-4 text-slate-400 text-sm w-full hover:text-white">Back to Login</button>
                         </form>
                    )}

                    {view === "reset" && (
                         <form onSubmit={handleResetPassword}>
                              <h2 className="text-2xl font-black mb-6 text-center text-white">Enter New Password</h2>
                              <input type="text" placeholder="6-Digit Code" required className="w-full mb-4 p-4 rounded-2xl bg-white/5 border border-white/10 text-white text-center tracking-[0.5em] font-bold focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, otp: e.target.value })} />
                              <input type="password" placeholder="New Password" required className="w-full mb-6 p-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
                              <button type="submit" className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 transition">Reset Password</button>
                         </form>
                    )}
               </div>
          </div>
     );
};

export default Login;