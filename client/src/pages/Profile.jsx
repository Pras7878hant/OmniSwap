import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

const Profile = () => {
     const { user, updateUser, logout } = useAuth();
     const navigate = useNavigate();

     const [skillsHave, setSkillsHave] = useState("");
     const [skillsWant, setSkillsWant] = useState("");
     const [image, setImage] = useState(null);
     const [newName, setNewName] = useState(user?.name || "");

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

               updateUser({ ...user, ...res.data });
               setImage(null);
               alert("Image uploaded successfully");
          } catch (err) {
               console.error(err);
               alert("Upload failed");
          }
     };

     const handleSaveSkills = async () => {
          try {
               const data = {};
               if (skillsHave.trim().length > 0) data.skillsHave = formatSkills(skillsHave);
               if (skillsWant.trim().length > 0) data.skillsWant = formatSkills(skillsWant);

               if (Object.keys(data).length === 0) {
                    alert("Enter at least one skill to update");
                    return;
               }

               const res = await API.put("/user/skills", data);
               updateUser({ ...user, ...res.data });
               setSkillsHave("");
               setSkillsWant("");
               alert("Profile skills updated");
          } catch (err) {
               console.error("ERROR:", err.response?.data || err.message);
               alert("Failed to save skills");
          }
     };

     const handleUpdateName = async () => {
          try {
               if (!newName.trim()) return alert("Name cannot be empty");

               const res = await API.put("/user/name", { name: newName });
               updateUser({ ...user, name: res.data.name });
               alert("Name updated successfully");
          } catch (err) {
               console.error(err);
               alert("Failed to update name");
          }
     };

     const handleDeleteAccount = async () => {
          const confirmDelete = window.confirm(
               "Are you sure you want to delete your account? This action is permanent and cannot be undone."
          );

          if (!confirmDelete) return;

          try {
               await API.delete("/user/delete");
               logout();
               navigate("/login");
          } catch (err) {
               console.error(err);
               alert("Failed to delete account");
          }
     };

     return (
          <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-12 relative overflow-hidden">

               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

               <div className="max-w-2xl mx-auto relative z-10">
                    <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden mb-12">

                         {/* Header*/}
                         <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-600 h-32 w-full"></div>

                         <div className="px-8 pb-10">
                              {/* Avatar Section */}
                              <div className="relative -mt-16 mb-8 flex flex-col items-center">
                                   <div className="relative group">
                                        <img
                                             src={user?.profilePic || `https://ui-avatars.com/api/?name=${user?.name}&background=6366f1&color=fff&size=128`}
                                             className="w-32 h-32 rounded-full object-cover border-4 border-[#0a0f1c] shadow-2xl bg-slate-800 transition-transform group-hover:scale-105"
                                             alt="Profile"
                                        />
                                        <label className="absolute bottom-1 right-1 bg-indigo-600 p-2.5 rounded-full cursor-pointer hover:bg-indigo-500 transition-all shadow-xl border-2 border-[#0a0f1c]">
                                             <span className="text-white text-xs font-bold">Edit</span>
                                             <input type="file" hidden onChange={(e) => setImage(e.target.files[0])} />
                                        </label>
                                   </div>

                                   {image && (
                                        <div className="mt-4 flex flex-col items-center bg-white/5 border border-white/10 p-3 rounded-xl">
                                             <p className="text-xs text-indigo-300 font-medium mb-2 italic">Ready to upload: {image.name}</p>
                                             <button onClick={handleUpload} className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all active:scale-95 shadow-lg">
                                                  Confirm Avatar Update
                                             </button>
                                        </div>
                                   )}
                              </div>

                              {/* Identity Info */}
                              <div className="text-center mb-10 border-b border-white/5 pb-8">
                                   <h2 className="text-3xl font-black text-white mb-1 tracking-tight">{user?.name}</h2>
                                   <p className="text-slate-400 font-medium tracking-wide">{user?.email}</p>
                              </div>

                              {/* Skills Section */}
                              <div className="grid md:grid-cols-2 gap-6 mb-10">
                                   <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">Skills I've Mastered</p>
                                        <div className="flex flex-wrap gap-2">
                                             {user?.skillsHave?.length ? user.skillsHave.map((s, i) => (
                                                  <span key={i} className="bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight">{s}</span>
                                             )) : <span className="text-slate-600 text-xs italic">No skills listed</span>}
                                        </div>
                                   </div>
                                   <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                                        <p className="text-[10px] font-bold text-fuchsia-400 uppercase tracking-widest mb-3">Currently Learning</p>
                                        <div className="flex flex-wrap gap-2">
                                             {user?.skillsWant?.length ? user.skillsWant.map((s, i) => (
                                                  <span key={i} className="bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-tight">{s}</span>
                                             )) : <span className="text-slate-600 text-xs italic">Goals not set</span>}
                                        </div>
                                   </div>
                              </div>

                              {/* Form Inputs for Skills */}
                              <div className="space-y-6">
                                   <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Add to Your Expertise</label>
                                        <input
                                             placeholder="e.g. JavaScript, React, Node.js"
                                             className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                                             onChange={(e) => setSkillsHave(e.target.value)}
                                             value={skillsHave}
                                        />
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Add to Your Wishlist</label>
                                        <input
                                             placeholder="e.g. AWS, Python, UI Design"
                                             className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-fuchsia-500 outline-none transition-all shadow-inner"
                                             onChange={(e) => setSkillsWant(e.target.value)}
                                             value={skillsWant}
                                        />
                                        <p className="text-[10px] text-slate-500 italic ml-1">* Use commas to separate multiple skills</p>
                                   </div>

                                   <button
                                        onClick={handleSaveSkills}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white font-black py-4 rounded-xl mt-6 transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95 uppercase tracking-widest text-sm"
                                   >
                                        Update Profile Matrix
                                   </button>
                              </div>

                              {/* Account Delete */}
                              <div className="mt-12 pt-10 border-t border-white/10 space-y-10">
                                   <div className="space-y-4">
                                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider ml-1">Change Display Name</label>
                                        <div className="flex gap-3">
                                             <input
                                                  placeholder="Enter new name"
                                                  className="flex-1 bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                                                  onChange={(e) => setNewName(e.target.value)}
                                                  value={newName}
                                             />
                                             <button
                                                  onClick={handleUpdateName}
                                                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 rounded-xl transition-all shadow-lg active:scale-95"
                                             >
                                                  Save
                                             </button>
                                        </div>
                                   </div>

                                   <div className="bg-red-500/5 border border-red-500/20 p-6 rounded-2xl">
                                        <h3 className="text-red-400 font-bold mb-2">Danger Zone</h3>
                                        <p className="text-xs text-slate-400 mb-5">Once you delete your account, there is no going back. Please be certain.</p>
                                        <button
                                             onClick={handleDeleteAccount}
                                             className="w-full bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95"
                                        >
                                             Delete Account
                                        </button>
                                   </div>
                              </div>

                         </div>
                    </div>
               </div>
          </div>
     );
};

export default Profile;