import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";


const Matches = () => {
     const [matches, setMatches] = useState([]);
     const [loading, setLoading] = useState(true);
     const navigate = useNavigate();

     // console.log("USER:", JSON.parse(localStorage.getItem("user")));

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
          <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

               <h1 className="text-3xl font-bold mb-8 text-center">
                    Your Matches 🤝
               </h1>

               {loading && (
                    <div className="flex justify-center items-center h-40">
                         <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
                    </div>
               )}

               {!loading && matches.length === 0 && (
                    <div className="text-center text-gray-500 mt-20">
                         <h2 className="text-xl font-semibold mb-2">
                              No matches found 😢
                         </h2>
                         <p>Try adding more skills in your profile.</p>
                    </div>
               )}

               <div className="grid md:grid-cols-3 gap-6">
                    {!loading &&
                         matches.map((user) => (
                              <div
                                   key={user._id}
                                   className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 border border-gray-100"
                              >
                                   <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 bg-indigo-500 text-white flex items-center justify-center rounded-full text-xl font-bold">
                                             {user.name?.charAt(0).toUpperCase()}
                                        </div>

                                        <div>
                                             <h2 className="text-lg font-semibold">
                                                  {user.name}
                                             </h2>

                                             <p className="text-xs text-indigo-600 font-semibold">
                                                  Match Score: {user.score || 0}
                                             </p>
                                        </div>
                                   </div>

                                   <div className="mb-3">
                                        <p className="text-xs text-gray-500 mb-1">Has</p>
                                        <div className="flex flex-wrap gap-2">
                                             {user.skillsHave?.length
                                                  ? user.skillsHave.map((skill, i) => (
                                                       <span
                                                            key={i}
                                                            className="bg-green-100 text-green-700 px-2 py-1 text-xs rounded"
                                                       >
                                                            {skill}
                                                       </span>
                                                  ))
                                                  : <span className="text-gray-400 text-xs">No skills</span>}
                                        </div>
                                   </div>

                                   <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-1">Wants</p>
                                        <div className="flex flex-wrap gap-2">
                                             {user.skillsWant?.length
                                                  ? user.skillsWant.map((skill, i) => (
                                                       <span
                                                            key={i}
                                                            className="bg-blue-100 text-blue-700 px-2 py-1 text-xs rounded"
                                                       >
                                                            {skill}
                                                       </span>
                                                  ))
                                                  : <span className="text-gray-400 text-xs">No skills</span>}
                                        </div>
                                   </div>

                                   <button
                                        onClick={() => navigate(`/chat/${user._id}`)}
                                        className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                                   >
                                        Connect & Chat
                                   </button>
                              </div>
                         ))}
               </div>

          </div>
     );
};

export default Matches;