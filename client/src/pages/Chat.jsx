import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../services/socket";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

const Chat = () => {
     const { id } = useParams();
     const { user } = useAuth();
     const navigate = useNavigate();

     const [messages, setMessages] = useState([]);
     const [text, setText] = useState("");

     const [onlineUsers, setOnlineUsers] = useState([]);
     const [typing, setTyping] = useState(false);
     const [seen, setSeen] = useState(false);

     useEffect(() => {
          const fetchMessages = async () => {
               if (!id) return;
               try {
                    const res = await API.get(`/messages/${id}`);
                    setMessages(res.data);
               } catch (err) {
                    console.error(err);
               }
          };

          fetchMessages();
     }, [id]);

     useEffect(() => {
          if (!user) return;

          socket.emit("join", user._id);

          socket.on("onlineUsers", (users) => {
               setOnlineUsers(users);
          });

          socket.on("receiveMessage", (data) => {
               setMessages((prev) => [...prev, data]);
               setSeen(true);
          });

          socket.on("typing", (sender) => {
               if (sender === id) {
                    setTyping(true);
                    setTimeout(() => setTyping(false), 1200);
               }
          });

          socket.on("seen", () => {
               setSeen(true);
          });

          return () => {
               socket.off("onlineUsers");
               socket.off("receiveMessage");
               socket.off("typing");
               socket.off("seen");
          };
     }, [user, id]);

     useEffect(() => {
          if (messages.length > 0 && id) {
               socket.emit("seen", {
                    sender: user._id,
                    receiver: id
               });
          }
     }, [messages, id, user]);

     const handleTyping = (e) => {
          setText(e.target.value);

          if (id) {
               socket.emit("typing", {
                    sender: user._id,
                    receiver: id
               });
          }
     };

     const sendMessage = async () => {
          if (!text.trim() || !id) return;

          try {
               const res = await API.post("/messages", {
                    receiverId: id,
                    text
               });

               setMessages((prev) => [...prev, res.data]);

               socket.emit("sendMessage", res.data);

               setSeen(false);
               setText("");
          } catch (err) {
               console.error(err);
          }
     };

     const openWhiteboard = () => {
          if (!id) return;
          const sharedRoomId = [user._id, id].sort().join("-");
          navigate(`/whiteboard/${sharedRoomId}`);
     };

     if (!id) {
          return (
               <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4">
                    <div className="text-center text-slate-400 bg-white/5 border border-white/10 p-10 rounded-2xl backdrop-blur-xl max-w-md w-full shadow-2xl">
                         <span className="text-6xl block mb-4">💬</span>
                         <h2 className="text-2xl font-bold text-white mb-2">Your Messages</h2>
                         <p className="mb-6">Please select a conversation from your matches to start chatting.</p>
                         <button
                              onClick={() => navigate("/matches")}
                              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold transition-all"
                         >
                              Find Matches
                         </button>
                    </div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-100 flex flex-col p-4">
               <div className="flex justify-between items-center mb-2">
                    <div className="text-sm font-medium">
                         {onlineUsers.includes(id) ? "🟢 Online" : "⚪ Offline"}
                    </div>

                    <button
                         onClick={openWhiteboard}
                         className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm font-semibold"
                    >
                         Open Shared Whiteboard
                    </button>
               </div>

               <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">
                    {messages.length === 0 && (
                         <p className="text-center text-gray-400 mt-4">
                              No messages yet
                         </p>
                    )}

                    {messages.map((msg, i) => (
                         <div key={msg._id}>
                              <div
                                   className={`p-3 rounded-lg max-w-xs ${msg.sender === user?._id
                                        ? "bg-indigo-600 text-white self-end ml-auto"
                                        : "bg-gray-300 self-start"
                                        }`}
                              >
                                   {msg.text}
                              </div>

                              {msg.sender === user?._id && i === messages.length - 1 && (
                                   <p className="text-xs text-right mr-2 mt-1 text-gray-500">
                                        {seen ? "✔✔ Seen" : "✔ Sent"}
                                   </p>
                              )}
                         </div>
                    ))}

                    {typing && (
                         <p className="text-xs text-gray-500">Typing...</p>
                    )}
               </div>

               <div className="flex gap-2">
                    <input
                         value={text}
                         onChange={handleTyping}
                         className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                         placeholder="Type message..."
                    />

                    <button
                         onClick={sendMessage}
                         className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700 font-medium"
                    >
                         Send
                    </button>
               </div>
          </div>
     );
};

export default Chat;