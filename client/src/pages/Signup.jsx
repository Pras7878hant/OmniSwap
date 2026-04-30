import { useState } from "react";
import axios from "axios";

const Signup = () => {
     const [form, setForm] = useState({
          name: "",
          email: "",
          password: "",
     });

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const res = await axios.post(
                    "http://localhost:5000/api/auth/register",
                    form,
               );
               console.log(res.data);
               alert("Signup successful!");
          } catch (err) {
               console.log(err);
          }
     };

     return (
          <div className="min-h-screen flex items-center justify-center bg-gray-100">
               <form
                    onSubmit={handleSubmit}
                    className="bg-white p-8 rounded-xl shadow-lg w-96"
               >
                    <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

                    <input
                         type="text"
                         placeholder="Name"
                         className="w-full mb-4 p-2 border rounded"
                         onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />

                    <input
                         type="email"
                         placeholder="Email"
                         className="w-full mb-4 p-2 border rounded"
                         onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />

                    <input
                         type="password"
                         placeholder="Password"
                         className="w-full mb-4 p-2 border rounded"
                         onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />

                    <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                         Signup
                    </button>
               </form>
          </div>
     );
};

export default Signup;
