import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
     const { user, logout } = useAuth();
     const navigate = useNavigate();
     const [isOpen, setIsOpen] = useState(false);

     const handleLogout = () => {
          logout();
          navigate("/login");
          setIsOpen(false);
     };

     return (
          <nav className="bg-[#0a0f1c]/90 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
               <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link to="/" className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-500">
                         OmniSwap
                    </Link>

                    <div className="md:hidden">
                         <button
                              onClick={() => setIsOpen(!isOpen)}
                              className="text-slate-300 hover:text-white focus:outline-none"
                         >
                              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   {isOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                   ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                   )}
                              </svg>
                         </button>
                    </div>

                    <div className="hidden md:flex gap-8 items-center">
                         <Link to="/" className="text-slate-300 hover:text-white font-medium transition-colors">Home</Link>
                         <Link to="/dashboard" className="text-slate-300 hover:text-white font-medium transition-colors">Dashboard</Link>
                         <Link to="/matches" className="text-slate-300 hover:text-white font-medium transition-colors">Matches</Link>
                         <Link to="/notes" className="text-slate-300 hover:text-white font-medium transition-colors">Notes</Link>
                         <Link to="/roadmap" className="text-slate-300 hover:text-white font-medium transition-colors">Roadmaps</Link>

                         {user ? (
                              <div className="flex items-center gap-6 border-l border-white/10 pl-6">
                                   <Link to="/profile" className="flex items-center gap-3 group">
                                        <img
                                             src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                                             className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-indigo-400 transition-all object-cover"
                                             alt="Profile"
                                        />
                                        <span className="text-sm font-semibold text-slate-200 group-hover:text-white transition-colors">{user.name}</span>
                                   </Link>
                                   <button
                                        onClick={handleLogout}
                                        className="bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                                   >
                                        Logout
                                   </button>
                              </div>
                         ) : (
                              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                                   <Link to="/login" className="text-slate-300 hover:text-white font-medium transition-colors">Login</Link>
                                   <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">Sign Up</Link>
                              </div>
                         )}
                    </div>
               </div>

               {isOpen && (
                    <div className="md:hidden bg-[#0f172a] border-b border-white/10 px-6 py-5 flex flex-col gap-5 absolute w-full left-0 top-full shadow-2xl">
                         <Link to="/" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium text-lg">Home</Link>
                         <Link to="/dashboard" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium text-lg">Dashboard</Link>
                         <Link to="/matches" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium text-lg">Matches</Link>
                         <Link to="/notes" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium text-lg">Notes</Link>
                         <Link to="/roadmap" onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-white font-medium text-lg">Roadmaps</Link>

                         {user ? (
                              <div className="mt-2 pt-5 border-t border-white/10 flex flex-col gap-5">
                                   <Link to="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                                        <img
                                             src={user.profilePic || `https://ui-avatars.com/api/?name=${user.name}&background=6366f1&color=fff`}
                                             className="w-12 h-12 rounded-full object-cover"
                                             alt="Profile"
                                        />
                                        <div>
                                             <p className="text-base font-bold text-white">{user.name}</p>
                                             <p className="text-xs text-indigo-400">View Profile</p>
                                        </div>
                                   </Link>
                                   <button
                                        onClick={handleLogout}
                                        className="w-full bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white px-4 py-3 rounded-xl text-center font-bold transition-all"
                                   >
                                        Logout
                                   </button>
                              </div>
                         ) : (
                              <div className="mt-2 pt-5 border-t border-white/10 flex flex-col gap-4">
                                   <Link to="/login" onClick={() => setIsOpen(false)} className="text-center text-slate-300 hover:text-white font-medium py-2">Login</Link>
                                   <Link to="/signup" onClick={() => setIsOpen(false)} className="text-center bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">Sign Up</Link>
                              </div>
                         )}
                    </div>
               )}
          </nav>
     );
};

export default Navbar;