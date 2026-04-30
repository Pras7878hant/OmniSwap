import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Navbar = () => {
     const { user, logout } = useAuth();
     const navigate = useNavigate();

     return (
          <div className="bg-white shadow-md px-6 py-3 flex justify-between items-center">

               <Link to="/" className="text-xl font-bold text-indigo-600">
                    SkillSwap
               </Link>

               <div className="flex gap-5 items-center">

                    <Link to="/" className="hover:text-indigo-600">
                         Home
                    </Link>

                    <Link to="/dashboard" className="hover:text-indigo-600">
                         Dashboard
                    </Link>

                    <Link to="/matches" className="hover:text-indigo-600">
                         Matches
                    </Link>

                    <img
                         src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}`}
                         className="w-8 h-8 rounded-full"
                    />

                    <span className="text-gray-500 text-sm">
                         {user?.name}
                    </span>

                    <button
                         onClick={() => {
                              logout();
                              navigate("/login");
                         }}
                         className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                         Logout
                    </button>

               </div>
          </div>
     );
};

export default Navbar;