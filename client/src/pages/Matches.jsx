import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Matches = () => {
     const [matches, setMatches] = useState([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     useEffect(() => {
          const fetchMatches = async () => {
               try {
                    const res = await API.get("/user/matches");
                    setMatches(res.data);
               } catch (error) {
                    console.error(error);
               } finally {
                    setLoading(false);
               }
          };

          fetchMatches();
     }, []);

     return (
          <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none"></div>

               <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                         <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400 mb-4">
                              Your Matches 🤝
                         </h1>
                         <p className="text-slate-400 text-lg">
                              Connect with peers to exchange skills and grow together.
                         </p>
                    </div>

                    {loading && (
                         <div className="flex justify-center items-center h-40">
                              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-fuchsia-500 border-r-transparent"></div>
                         </div>
                    )}

                    {!loading && matches.length === 0 && (
                         <div className="text-center bg-white/5 border border-white/10 p-12 rounded-3xl max-w-2xl mx-auto backdrop-blur-sm">
                              <div className="text-6xl mb-4">😢</div>
                              <h2 className="text-2xl font-bold text-white mb-2">
                                   No matches found yet
                              </h2>
                              <p className="text-slate-400 mb-6">
                                   Try adding more specific technologies to your "Skills Have" and "Skills Want" lists.
                              </p>
                              <button
                                   onClick={() => navigate("/profile")}
                                   className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-6 py-3 rounded-xl font-bold hover:bg-indigo-600 hover:text-white transition-all"
                              >
                                   Update Profile Skills
                              </button>
                         </div>
                    )}

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                         {!loading && matches.map((user) => (
                              <div
                                   key={user._id}
                                   className="bg-white/5 border border-white/10 p-6 rounded-2xl hover:bg-white/10 hover:border-fuchsia-500/30 transition-all group flex flex-col h-full backdrop-blur-sm"
                              >
                                   <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
                                        {user.profilePic ? (
                                             <img
                                                  src={user.profilePic}
                                                  alt={user.name}
                                                  className="w-16 h-16 rounded-full object-cover border-2 border-indigo-500/50"
                                             />
                                        ) : (
                                             <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center rounded-full text-2xl font-bold shadow-lg">
                                                  {user.name?.charAt(0).toUpperCase()}
                                             </div>
                                        )}

                                        <div>
                                             <h2 className="text-xl font-bold text-white">
                                                  {user.name}
                                             </h2>
                                             <div className="inline-flex items-center mt-1 bg-fuchsia-500/10 text-fuchsia-400 text-xs font-bold px-2.5 py-1 rounded-full border border-fuchsia-500/20">
                                                  Score: {user.score || 0}% Match
                                             </div>
                                        </div>
                                   </div>

                                   <div className="flex-1 flex flex-col gap-4">
                                        <div>
                                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">They Have</p>
                                             <div className="flex flex-wrap gap-2">
                                                  {user.skillsHave?.length ? (
                                                       user.skillsHave.map((skill, i) => (
                                                            <span key={i} className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 text-xs font-medium rounded-lg">
                                                                 {skill}
                                                            </span>
                                                       ))
                                                  ) : (
                                                       <span className="text-slate-500 text-sm">No skills listed</span>
                                                  )}
                                             </div>
                                        </div>

                                        <div>
                                             <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">They Want</p>
                                             <div className="flex flex-wrap gap-2">
                                                  {user.skillsWant?.length ? (
                                                       user.skillsWant.map((skill, i) => (
                                                            <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 text-xs font-medium rounded-lg">
                                                                 {skill}
                                                            </span>
                                                       ))
                                                  ) : (
                                                       <span className="text-slate-500 text-sm">No goals listed</span>
                                                  )}
                                             </div>
                                        </div>
                                   </div>

                                   <button
                                        onClick={() => navigate(`/chat/${user._id}`)}
                                        className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] active:scale-95"
                                   >
                                        💬 Message {user.name.split(' ')[0]}
                                   </button>
                              </div>
                         ))}
                    </div>
               </div>
          </div>
     );
};

export default Matches;