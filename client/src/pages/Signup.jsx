import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const Signup = () => {
     const navigate = useNavigate();
     const [step, setStep] = useState(1);
     const [form, setForm] = useState({ name: "", email: "", password: "", otp: "" });

     //Send OTP to Email
     const handleRequestOTP = async (e) => {
          e.preventDefault();
          try {
               await API.post("/auth/request-otp", { email: form.email, type: "signup" });
               setStep(2);
          } catch (error) {
               alert(error.response?.data?.message || "Failed to send OTP");
          }
     };

     //Verify OTP and create user
     const handleVerifySignup = async (e) => {
          e.preventDefault();
          try {
               await API.post("/auth/verify-signup", form);
               alert("Account created successfully!");
               navigate("/login");
          } catch (error) {
               alert(error.response?.data?.message || "Invalid OTP");
          }
     };

     return (
          <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden bg-slate-950">
               <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/60 via-slate-950 to-black"></div>
               <div className="absolute w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] -top-40 -left-20 animate-pulse"></div>

               <form onSubmit={step === 1 ? handleRequestOTP : handleVerifySignup} className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-xl p-10 rounded-3xl shadow-2xl w-full max-w-md">
                    <h2 className="text-4xl font-black mb-8 text-center tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-indigo-100 to-purple-300 drop-shadow-lg">
                         Join OmniSwap
                    </h2>

                    {step === 1 ? (
                         <>
                              <input type="text" placeholder="Name" required className="w-full mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, name: e.target.value })} />
                              <input type="email" placeholder="Email" required className="w-full mb-5 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, email: e.target.value })} />
                              <input type="password" placeholder="Password" required className="w-full mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none" onChange={(e) => setForm({ ...form, password: e.target.value })} />
                              <button type="submit" className="w-full py-4 rounded-2xl bg-indigo-600 text-white font-bold text-lg hover:bg-indigo-500 transition-all">
                                   Send Verification Code
                              </button>
                         </>
                    ) : (
                         <>
                              <p className="text-sm text-slate-300 text-center mb-6">Enter the 6-digit code sent to {form.email}</p>
                              <input type="text" placeholder="6-Digit OTP" required className="w-full mb-8 p-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 outline-none text-center tracking-[0.5em] font-bold" onChange={(e) => setForm({ ...form, otp: e.target.value })} />
                              <button type="submit" className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-bold text-lg hover:bg-emerald-500 transition-all">
                                   Verify & Signup
                              </button>
                         </>
                    )}
               </form>
          </div>
     );
};

export default Signup;