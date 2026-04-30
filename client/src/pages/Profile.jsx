import { useState } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

const Profile = () => {
     const { user, updateUser } = useAuth();  // ✅ FIXED

     const [skillsHave, setSkillsHave] = useState("");
     const [skillsWant, setSkillsWant] = useState("");
     const [image, setImage] = useState(null);

     const formatSkills = (text) => {
          return text
               .split(",")
               .map((s) => s.trim().toLowerCase())
               .filter((s) => s.length > 0);
     };

     const handleUpload = async () => {
          try {
               if (!image) return alert("Select image first");

               const formData = new FormData();
               formData.append("image", image);

               const res = await API.post("/user/upload", formData);

               if (!res.data) return;

               updateUser(res.data);
               alert("Image uploaded");

          } catch (err) {
               console.error(err);
               alert("Upload failed");
          }
     };

     const handleSave = async () => {
          try {
               const res = await API.put("/user/skills", {
                    skillsHave: formatSkills(skillsHave),
                    skillsWant: formatSkills(skillsWant)
               });

               if (!res.data) return;

               updateUser(res.data);
               alert("Skills updated");

          } catch (err) {
               console.error(err);
               alert("Failed to save skills");
          }
     };

     return (
          <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">

               <div className="bg-white p-6 rounded-2xl shadow-xl max-w-xl mx-auto">

                    <h2 className="text-2xl font-bold mb-4">Your Profile</h2>

                    <p className="mb-2">
                         <strong>Name:</strong> {user?.name}
                    </p>

                    <p className="mb-4">
                         <strong>Email:</strong> {user?.email}
                    </p>

                    <div className="mb-4">
                         <p className="text-sm font-semibold mb-1">Current Skills</p>
                         <p className="text-sm text-gray-500">
                              {user?.skillsHave?.join(", ") || "None"}
                         </p>
                    </div>

                    <div className="mb-4">
                         <p className="text-sm font-semibold mb-1">Learning</p>
                         <p className="text-sm text-gray-500">
                              {user?.skillsWant?.join(", ") || "None"}
                         </p>
                    </div>

                    <div className="flex flex-col items-center mb-6">

                         <img
                              src={
                                   user?.profilePic ||
                                   `https://ui-avatars.com/api/?name=${user?.name}`
                              }
                              className="w-24 h-24 rounded-full object-cover mb-4 border"
                         />

                         <label className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition">
                              Select Image
                              <input
                                   type="file"
                                   hidden
                                   onChange={(e) => setImage(e.target.files[0])}
                              />
                         </label>

                         {image && (
                              <p className="text-sm text-gray-500 mt-2">
                                   {image.name}
                              </p>
                         )}

                         <button
                              onClick={handleUpload}
                              className="mt-3 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                         >
                              Upload
                         </button>

                    </div>

                    <input
                         placeholder="Skills you have e.g. js, react, node"
                         className="w-full border p-3 mb-3 rounded-lg"
                         onChange={(e) => setSkillsHave(e.target.value)}
                    />

                    <input
                         placeholder="skills you want e.g. python, design"
                         className="w-full border p-3 mb-4 rounded-lg"
                         onChange={(e) => setSkillsWant(e.target.value)}
                    />

                    <button
                         onClick={handleSave}
                         className="w-full bg-indigo-600 text-white py-2 rounded-lg"
                    >
                         Save Changes
                    </button>

               </div>

          </div>
     );
};

export default Profile;