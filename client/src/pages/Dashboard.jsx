import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Dashboard = () => {
     const navigate = useNavigate();
     const { user } = useAuth();

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

               <div className="bg-white p-6 rounded-2xl shadow-xl mb-6">
                    <h1 className="text-2xl font-bold">
                         Welcome, {user?.name} 👋
                    </h1>
                    <p className="text-gray-500 mt-1">
                         Manage your skills and connections
                    </p>
               </div>

               <div className="grid md:grid-cols-3 gap-6">

                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="font-semibold mb-2">🧠 Add Skills</h2>
                         <button
                              onClick={() => navigate("/profile")}
                              className="bg-indigo-600 text-white px-4 py-2 rounded"
                         >
                              Go to Profile
                         </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="font-semibold mb-2">🤝 View Matches</h2>
                         <button
                              onClick={() => navigate("/matches")}
                              className="bg-indigo-600 text-white px-4 py-2 rounded"
                         >
                              Find Matches
                         </button>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                         <h2 className="font-semibold mb-2">💬 Start Chat</h2>
                         <button
                              onClick={() => navigate("/matches")}
                              className="bg-indigo-600 text-white px-4 py-2 rounded"
                         >
                              Open Matches
                         </button>
                    </div>

               </div>

               {/* Skills Section */}
               <div className="grid md:grid-cols-2 gap-6 mt-8">

                    <div className="bg-white p-6 rounded-xl shadow">
                         <h2 className="font-semibold mb-2">Your Skills</h2>
                         <p className="text-gray-500">
                              {user?.skillsHave?.length
                                   ? user.skillsHave.join(", ")
                                   : "No skills added"}
                         </p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow">
                         <h2 className="font-semibold mb-2">Learning</h2>
                         <p className="text-gray-500">
                              {user?.skillsWant?.length
                                   ? user.skillsWant.join(", ")
                                   : "No skills added"}
                         </p>
                    </div>

               </div>

          </div>
     );
};

export default Dashboard;