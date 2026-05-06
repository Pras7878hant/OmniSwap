import { useState, useEffect } from "react";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

const Notes = () => {
     const { user } = useAuth();
     const [notes, setNotes] = useState([]);
     const [search, setSearch] = useState("");
     const [filter, setFilter] = useState("all");
     const [editingId, setEditingId] = useState(null);

     const [form, setForm] = useState({
          title: "",
          content: "",
          skill: "",
          type: "notes",
          link: ""
     });

     useEffect(() => {
          fetchNotes();
     }, []);

     const fetchNotes = async () => {
          try {
               const res = await API.get("/notes/matched");
               setNotes(res.data || []);
          } catch (error) {
               console.error(error);
          }
     };

     const handleSubmit = async (e) => {
          e.preventDefault();
          if (!form.title || !form.content || !form.skill) return;

          try {
               if (editingId) {
                    const res = await API.put(`/notes/${editingId}`, form);
                    setNotes(notes.map(n => n._id === editingId ? res.data : n));
                    setEditingId(null);
               } else {
                    await API.post("/notes", form);
                    fetchNotes();
               }
               setForm({ title: "", content: "", skill: "", type: "notes", link: "" });
          } catch (error) {
               console.error(error);
          }
     };

     const deleteNote = async (id) => {
          try {
               await API.delete(`/notes/${id}`);
               setNotes(notes.filter(n => n._id !== id));
          } catch (error) {
               console.error(error);
          }
     };

     const filteredNotes = notes.filter(n => {
          const matchSearch =
               n.title.toLowerCase().includes(search.toLowerCase()) ||
               n.skill.toLowerCase().includes(search.toLowerCase());
          const matchFilter = filter === "all" || n.type === filter;
          return matchSearch && matchFilter;
     });

     return (
          <div className="min-h-screen bg-[#0a0f1c] text-slate-200 p-6 md:p-12 relative overflow-hidden">
               <div className="absolute top-0 right-1/4 w-[600px] h-[400px] bg-cyan-600/10 blur-[120px] rounded-full pointer-events-none"></div>
               <div className="absolute bottom-0 left-1/4 w-[600px] h-[400px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>

               <div className="max-w-7xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                         <h1 className="text-4xl md:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400 mb-4">
                              Skill Notes 📚
                         </h1>
                         <p className="text-slate-400 text-lg">
                              Share knowledge, document projects, and ask questions.
                         </p>
                    </div>

                    <div className="max-w-3xl mx-auto mb-10">
                         <form onSubmit={handleSubmit} className="bg-white/5 border border-white/10 backdrop-blur-xl p-6 md:p-8 rounded-3xl shadow-2xl">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                   <input
                                        value={form.title}
                                        placeholder="Note Title"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                                   />
                                   <input
                                        value={form.skill}
                                        placeholder="Related Skill (e.g. React)"
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        onChange={(e) => setForm({ ...form, skill: e.target.value })}
                                   />
                              </div>
                              <textarea
                                   value={form.content}
                                   placeholder="Write your content here... Make it easy to read."
                                   rows="4"
                                   className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none mb-4 resize-none leading-relaxed"
                                   onChange={(e) => setForm({ ...form, content: e.target.value })}
                              />
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                   <select
                                        value={form.type}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none appearance-none"
                                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                                   >
                                        <option value="notes" className="bg-slate-900">Notes</option>
                                        <option value="project" className="bg-slate-900">Project</option>
                                        <option value="question" className="bg-slate-900">Question</option>
                                   </select>
                                   <input
                                        value={form.link}
                                        placeholder="Project/Resource URL (Optional)"
                                        className="w-full md:col-span-2 bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none"
                                        onChange={(e) => setForm({ ...form, link: e.target.value })}
                                   />
                              </div>
                              <button className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] active:scale-95">
                                   {editingId ? "Save Changes" : "Publish Note"}
                              </button>
                         </form>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-7xl mx-auto">
                         <div className="relative flex-1">
                              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                              <input
                                   placeholder="Search notes or skills..."
                                   className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                                   onChange={(e) => setSearch(e.target.value)}
                              />
                         </div>
                         <select
                              className="bg-white/5 border border-white/10 rounded-xl py-3 px-6 text-white focus:ring-2 focus:ring-cyan-500 outline-none appearance-none cursor-pointer"
                              onChange={(e) => setFilter(e.target.value)}
                         >
                              <option value="all" className="bg-slate-900">All Types</option>
                              <option value="notes" className="bg-slate-900">Notes</option>
                              <option value="project" className="bg-slate-900">Projects</option>
                              <option value="question" className="bg-slate-900">Questions</option>
                         </select>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                         {filteredNotes.map(note => (
                              <div key={note._id} className="bg-slate-800/40 border border-slate-700/50 rounded-2xl p-8 flex flex-col min-h-[500px] backdrop-blur-sm hover:bg-slate-800/60 transition-all shadow-xl">

                                   <div className="flex justify-between items-start mb-6">
                                        <h2 className="text-2xl font-bold text-white leading-tight pr-4">{note.title}</h2>
                                        <div className="flex gap-2 shrink-0">
                                             <span className="bg-emerald-500/10 text-emerald-400 text-[11px] font-bold px-3 py-1.5 rounded-md border border-emerald-500/20 uppercase tracking-wider">
                                                  {note.skill}
                                             </span>
                                             <span className="bg-cyan-500/10 text-cyan-400 text-[11px] font-bold px-3 py-1.5 rounded-md border border-cyan-500/20 uppercase tracking-wider">
                                                  {note.type}
                                             </span>
                                        </div>
                                   </div>

                                   {note.link && (
                                        <a href={note.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-cyan-400 text-base hover:text-cyan-300 mb-6 font-medium transition-colors w-max">
                                             🔗 View Attached Link
                                        </a>
                                   )}

                                   <div className="flex-1 bg-black/30 rounded-xl p-6 mb-6 border border-white/5 overflow-hidden">
                                        <p className="text-slate-200 text-base md:text-lg leading-relaxed whitespace-pre-wrap max-h-[480px] overflow-y-auto custom-scrollbar font-sans">
                                             {note.content}
                                        </p>
                                   </div>

                                   <div className="pt-6 border-t border-slate-700/50">
                                        <div className="flex items-center justify-between mb-6">
                                             <button
                                                  onClick={async () => {
                                                       try {
                                                            const res = await API.put(`/notes/${note._id}/like`);
                                                            setNotes(notes.map(n => n._id === note._id ? res.data : n));
                                                       } catch (err) {
                                                            console.error(err);
                                                       }
                                                  }}
                                                  className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors font-medium bg-white/5 px-4 py-2 rounded-lg border border-white/5"
                                             >
                                                  <span className="text-xl">👍</span>
                                                  <span className="text-lg">{note.likes?.length || 0}</span>
                                             </button>

                                             {note.userId?._id === user?._id && (
                                                  <div className="flex gap-4">
                                                       <button
                                                            onClick={() => {
                                                                 setForm(note);
                                                                 setEditingId(note._id);
                                                                 window.scrollTo({ top: 0, behavior: 'smooth' });
                                                            }}
                                                            className="text-slate-400 hover:text-cyan-400 text-base font-medium transition-colors"
                                                       >
                                                            Edit
                                                       </button>
                                                       <button
                                                            onClick={() => deleteNote(note._id)}
                                                            className="text-slate-400 hover:text-red-400 text-base font-medium transition-colors"
                                                       >
                                                            Delete
                                                       </button>
                                                  </div>
                                             )}
                                        </div>

                                        <div className="space-y-4">
                                             {note.comments?.map((c, i) => (
                                                  <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/5 text-base">
                                                       <span className="font-bold text-cyan-400 mr-2">{c.userId?.name}</span>
                                                       <span className="text-slate-300 leading-relaxed">{c.text}</span>
                                                  </div>
                                             ))}
                                             <input
                                                  placeholder="Write a comment and press Enter..."
                                                  className="w-full bg-black/20 border border-white/10 rounded-lg py-3 px-4 text-base text-white focus:ring-2 focus:ring-cyan-500 outline-none placeholder:text-slate-500 mt-3"
                                                  onKeyDown={async (e) => {
                                                       if (e.key === "Enter" && e.target.value.trim()) {
                                                            try {
                                                                 const res = await API.post(`/notes/${note._id}/comment`, {
                                                                      text: e.target.value
                                                                 });
                                                                 setNotes(notes.map(n => n._id === note._id ? res.data : n));
                                                                 e.target.value = "";
                                                            } catch (err) {
                                                                 console.error(err);
                                                            }
                                                       }
                                                  }}
                                             />
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               </div>
          </div>
     );
};

export default Notes;