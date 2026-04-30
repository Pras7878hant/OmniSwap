import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
     const navigate = useNavigate();
     const { user, logout } = useAuth();

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

               {/* Header */}
               <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
                    <h1 className="text-2xl font-bold">
                         Welcome, {user?.name} 👋
                    </h1>

                    <div className="grid md:grid-cols-2 gap-6 mt-6">

                         <div className="bg-white p-6 rounded-xl shadow">
                              <h2 className="font-semibold mb-2">Your Skills</h2>
                              <p className="text-sm text-gray-500">
                                   {user?.skillsHave?.join(", ") || "None"}
                              </p>
                         </div>

                         <div className="bg-white p-6 rounded-xl shadow">
                              <h2 className="font-semibold mb-2">Learning</h2>
                              <p className="text-sm text-gray-500">
                                   {user?.skillsWant?.join(", ") || "None"}
                              </p>
                         </div>

                    </div>
                    <p className="text-gray-500 mt-1">
                         Start building your skill profile
                    </p>
               </div>

               {/* Actions */}
               <div className="grid md:grid-cols-3 gap-6">

                    {/* Add Skills */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="font-semibold text-lg mb-2">🧠 Add Skills</h2>
                         <p className="text-sm text-gray-500 mb-4">
                              Tell others what you know and what you want to learn
                         </p>
                         <button
                              onClick={() => navigate("/dashboard#skills")}
                              className="bg-indigo-600 text-white px-4 py-2 rounded"
                         >
                              Add Skills
                         </button>
                    </div>

                    {/* Find Matches */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="font-semibold text-lg mb-2">🤝 Find Matches</h2>
                         <p className="text-sm text-gray-500 mb-4">
                              Discover people who match your skills
                         </p>
                         <button
                              onClick={() => navigate("/matches")}
                              className="bg-indigo-600 text-white px-4 py-2 rounded"
                         >
                              View Matches
                         </button>
                    </div>

                    {/* Chat */}
                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="font-semibold text-lg mb-2">💬 Chat</h2>
                         <p className="text-sm text-gray-500 mb-4">
                              Talk and learn together
                         </p>
                         <button
                              onClick={() => navigate("/matches")}
                              className="bg-indigo-600 text-white px-4 py-2 rounded"
                         >
                              Start Chat
                         </button>
                    </div>

               </div>

               {/* Logout */}
               <div className="mt-10 text-center">
                    <button
                         onClick={logout}
                         className="bg-red-500 text-white px-6 py-2 rounded-lg"
                    >
                         Logout
                    </button>
               </div>

          </div>
     );
};

export default Dashboard;