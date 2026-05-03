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
          const res = await API.get("/notes/matched");
          setNotes(res.data || []);
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          if (!form.title || !form.content || !form.skill) return;

          if (editingId) {
               const res = await API.put(`/notes/${editingId}`, form);
               setNotes(notes.map(n => n._id === editingId ? res.data : n));
               setEditingId(null);
          } else {
               await API.post("/notes", form);
               fetchNotes();
          }

          setForm({ title: "", content: "", skill: "", type: "notes", link: "" });
     };

     const deleteNote = async (id) => {
          await API.delete(`/notes/${id}`);
          setNotes(notes.filter(n => n._id !== id));
     };

     const filteredNotes = notes.filter(n => {
          const matchSearch =
               n.title.toLowerCase().includes(search.toLowerCase()) ||
               n.skill.toLowerCase().includes(search.toLowerCase());

          const matchFilter = filter === "all" || n.type === filter;

          return matchSearch && matchFilter;
     });

     return (
          <div className="p-6 bg-gray-100 min-h-screen">

               <h1 className="text-3xl font-bold text-center mb-6">Skill Notes 📚</h1>

               {/* SEARCH + FILTER */}
               <div className="flex gap-3 mb-6 max-w-xl mx-auto">
                    <input
                         placeholder="Search..."
                         className="flex-1 border p-2 rounded"
                         onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                         className="border p-2 rounded"
                         onChange={(e) => setFilter(e.target.value)}
                    >
                         <option value="all">All</option>
                         <option value="notes">Notes</option>
                         <option value="project">Project</option>
                         <option value="question">Question</option>
                    </select>
               </div>

               {/* FORM */}
               <form onSubmit={handleSubmit} className="bg-white p-4 rounded mb-6 max-w-xl mx-auto">
                    <input
                         value={form.title}
                         placeholder="Title"
                         className="w-full border p-2 mb-2"
                         onChange={(e) => setForm({ ...form, title: e.target.value })}
                    />
                    <textarea
                         value={form.content}
                         placeholder="Content"
                         className="w-full border p-2 mb-2"
                         onChange={(e) => setForm({ ...form, content: e.target.value })}
                    />
                    <input
                         value={form.skill}
                         placeholder="Skill"
                         className="w-full border p-2 mb-2"
                         onChange={(e) => setForm({ ...form, skill: e.target.value })}
                    />
                    <input
                         value={form.link}
                         placeholder="Project link"
                         className="w-full border p-2 mb-2"
                         onChange={(e) => setForm({ ...form, link: e.target.value })}
                    />
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded w-full">
                         {editingId ? "Update Note" : "Add Note"}
                    </button>
               </form>

               {/* NOTES */}
               <div className="grid md:grid-cols-3 gap-6">
                    {filteredNotes.map(note => (
                         <div key={note._id} className="bg-white p-4 rounded shadow">

                              <h2 className="font-bold">{note.title}</h2>

                              <p className="text-xs text-indigo-600 mb-1">
                                   {note.skill} • {note.type}
                              </p>

                              {note.link && (
                                   <a href={note.link} className="text-blue-500 text-xs underline">
                                        View Project
                                   </a>
                              )}

                              <p className="whitespace-pre-wrap break-words font-mono text-sm mt-2 max-h-48 overflow-y-auto">
                                   {note.content}
                              </p>

                              {/* LIKE */}
                              <button
                                   onClick={async () => {
                                        const res = await API.put(`/notes/${note._id}/like`);
                                        setNotes(notes.map(n => n._id === note._id ? res.data : n));
                                   }}
                              >
                                   👍 {note.likes?.length || 0}
                              </button>

                              {/* COMMENTS */}
                              <div className="mt-2">
                                   {note.comments?.map((c, i) => (
                                        <p key={i} className="text-xs">
                                             <b>{c.userId?.name}:</b> {c.text}
                                        </p>
                                   ))}

                                   <input
                                        placeholder="Comment..."
                                        className="w-full border mt-1 p-1 text-xs"
                                        onKeyDown={async (e) => {
                                             if (e.key === "Enter") {
                                                  const res = await API.post(`/notes/${note._id}/comment`, {
                                                       text: e.target.value
                                                  });
                                                  setNotes(notes.map(n => n._id === note._id ? res.data : n));
                                                  e.target.value = "";
                                             }
                                        }}
                                   />
                              </div>

                              {/* OWNER ACTIONS */}
                              {note.userId?._id === user?._id && (
                                   <div className="flex gap-2 mt-3">
                                        <button
                                             onClick={() => {
                                                  setForm(note);
                                                  setEditingId(note._id);
                                             }}
                                             className="text-blue-500 text-xs"
                                        >
                                             Edit
                                        </button>

                                        <button
                                             onClick={() => deleteNote(note._id)}
                                             className="text-red-500 text-xs"
                                        >
                                             Delete
                                        </button>
                                   </div>
                              )}

                         </div>
                    ))}
               </div>

          </div>
     );
};

export default Notes;