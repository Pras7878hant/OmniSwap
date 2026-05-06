import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
     const navigate = useNavigate();
     const { user } = useAuth();
     const [savedRoadmap, setSavedRoadmap] = useState(null);

     useEffect(() => {
          const roadmapData = localStorage.getItem("userRoadmap");
          if (roadmapData) {
               setSavedRoadmap(JSON.parse(roadmapData));
          }
     }, []);

     return (
          <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

               <div className="max-w-6xl mx-auto relative z-10">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl mb-8 flex items-center justify-between">
                         <div>
                              <h1 className="text-3xl md:text-4xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                                   Welcome back, {user?.name} 👋
                              </h1>
                              <p className="text-slate-400 mt-2 text-lg">
                                   Your central hub for skills and connections.
                              </p>
                         </div>
                         <div className="hidden md:block">
                              <div className="hidden md:block">
                                   <img
                                        src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff`}
                                        className="w-16 h-16 rounded-full border border-indigo-500/30 object-cover shadow-lg"
                                        alt="Profile"
                                   />
                              </div>
                         </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
                              <div className="text-3xl mb-4 grayscale-[0.5] group-hover:grayscale-0">🧠</div>
                              <h2 className="font-bold text-lg mb-2 text-white">Profile & Skills</h2>
                              <button onClick={() => navigate("/profile")} className="w-full mt-4 bg-indigo-600/20 text-indigo-400 py-2.5 rounded-xl font-semibold hover:bg-indigo-600 hover:text-white transition-all">
                                   Manage Profile
                              </button>
                         </div>

                         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
                              <div className="text-3xl mb-4 grayscale-[0.5] group-hover:grayscale-0">🤝</div>
                              <h2 className="font-bold text-lg mb-2 text-white">Connections</h2>
                              <button onClick={() => navigate("/matches")} className="w-full mt-4 bg-fuchsia-600/20 text-fuchsia-400 py-2.5 rounded-xl font-semibold hover:bg-fuchsia-600 hover:text-white transition-all">
                                   Find Matches
                              </button>
                         </div>

                         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group">
                              <div className="text-3xl mb-4 grayscale-[0.5] group-hover:grayscale-0">💬</div>
                              <h2 className="font-bold text-lg mb-2 text-white">Messages</h2>
                              <button onClick={() => navigate("/chat")} className="w-full mt-4 bg-emerald-600/20 text-emerald-400 py-2.5 rounded-xl font-semibold hover:bg-emerald-600 hover:text-white transition-all">
                                   Open Chat
                              </button>
                         </div>

                         <div className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 transition-all group relative overflow-hidden">
                              <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl"></div>
                              <div className="text-3xl mb-4 grayscale-[0.5] group-hover:grayscale-0">🗺️</div>
                              <h2 className="font-bold text-lg mb-2 text-white">Roadmaps</h2>
                              <button onClick={() => navigate("/roadmap")} className="w-full mt-4 bg-blue-600/20 text-blue-400 py-2.5 rounded-xl font-semibold hover:bg-blue-600 hover:text-white transition-all">
                                   View Hub
                              </button>
                         </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                         <div className="md:col-span-2 grid sm:grid-cols-2 gap-6">
                              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                   <h2 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                        Skills I Have
                                   </h2>
                                   <div className="flex flex-wrap gap-2">
                                        {user?.skillsHave?.length ? (
                                             user.skillsHave.map((skill, idx) => (
                                                  <span key={idx} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-lg text-sm font-medium">
                                                       {skill}
                                                  </span>
                                             ))
                                        ) : (
                                             <p className="text-slate-500 text-sm">No skills added yet.</p>
                                        )}
                                   </div>
                              </div>

                              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                                   <h2 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-fuchsia-500"></span>
                                        Skills I Want
                                   </h2>
                                   <div className="flex flex-wrap gap-2">
                                        {user?.skillsWant?.length ? (
                                             user.skillsWant.map((skill, idx) => (
                                                  <span key={idx} className="bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20 px-3 py-1 rounded-lg text-sm font-medium">
                                                       {skill}
                                                  </span>
                                             ))
                                        ) : (
                                             <p className="text-slate-500 text-sm">No goals added yet.</p>
                                        )}
                                   </div>
                              </div>
                         </div>

                         <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/20 p-6 rounded-2xl relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-2xl rounded-full"></div>
                              <h2 className="font-bold text-lg mb-4 text-white flex items-center gap-2">
                                   Active Roadmap
                              </h2>

                              {savedRoadmap ? (
                                   <div className="mt-4">
                                        <div className="bg-black/20 p-4 rounded-xl border border-white/5 mb-4">
                                             <p className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Current Goal</p>
                                             <p className="text-white font-semibold truncate">{savedRoadmap.title}</p>
                                        </div>
                                        <button onClick={() => navigate("/roadmap")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)]">
                                             Continue Progress
                                        </button>
                                   </div>
                              ) : (
                                   <div className="mt-4 text-center">
                                        <div className="bg-black/20 p-6 rounded-xl border border-white/5 mb-4">
                                             <p className="text-slate-400 text-sm">You haven't saved a roadmap yet.</p>
                                        </div>
                                        <button onClick={() => navigate("/roadmap")} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all">
                                             Explore Templates
                                        </button>
                                   </div>
                              )}
                         </div>
                    </div>

               </div>
          </div>
     );
};

export default Dashboard;