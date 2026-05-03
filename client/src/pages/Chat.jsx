import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";
import useAuth from "../hooks/useAuth";

const Chat = () => {
     const { id } = useParams();
     const { user } = useAuth();

     const [messages, setMessages] = useState([]);
     const [text, setText] = useState("");

     const [onlineUsers, setOnlineUsers] = useState([]);
     const [typing, setTyping] = useState(false);
     const [seen, setSeen] = useState(false);

     const socket = useRef(null);

     useEffect(() => {
          const fetchMessages = async () => {
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
          const BASE_URL =
               import.meta.env.VITE_API_URL?.replace("/api", "") ||
               "https://omniswap.onrender.com";

          socket.current = io(BASE_URL);

          socket.current.emit("join", user._id);

          socket.current.on("onlineUsers", (users) => {
               setOnlineUsers(users);
          });

          socket.current.on("receiveMessage", (data) => {
               setMessages((prev) => [...prev, data]);
               setSeen(true);
          });

          socket.current.on("typing", (sender) => {
               if (sender === id) {
                    setTyping(true);
                    setTimeout(() => setTyping(false), 1200);
               }
          });

          socket.current.on("seen", () => {
               setSeen(true);
          });

          return () => socket.current.disconnect();
     }, [user, id]);

     useEffect(() => {
          if (messages.length > 0) {
               socket.current.emit("seen", {
                    sender: user._id,
                    receiver: id
               });
          }
     }, [messages]);

     const handleTyping = (e) => {
          setText(e.target.value);

          socket.current.emit("typing", {
               sender: user._id,
               receiver: id
          });
     };

     const sendMessage = async () => {
          if (!text.trim()) return;

          try {
               const res = await API.post("/messages", {
                    receiverId: id,
                    text
               });

               setMessages((prev) => [...prev, res.data]);

               socket.current.emit("sendMessage", res.data);

               setSeen(false);
               setText("");
          } catch (err) {
               console.error(err);
          }
     };

     return (
          <div className="min-h-screen bg-gray-100 flex flex-col p-4">

               <div className="mb-2 text-sm">
                    {onlineUsers.includes(id) ? "🟢 Online" : "⚪ Offline"}
               </div>

               <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">

                    {messages.length === 0 && (
                         <p className="text-center text-gray-400">
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
                                   <p className="text-xs text-right mr-2">
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
                         className="flex-1 p-2 border rounded"
                         placeholder="Type message..."
                    />

                    <button
                         onClick={sendMessage}
                         className="bg-indigo-600 text-white px-4 rounded hover:bg-indigo-700"
                    >
                         Send
                    </button>
               </div>

          </div>
     );
};

export default Chat;