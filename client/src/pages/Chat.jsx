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
     const socket = useRef(null);

     // Fetch old messages
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

     // Socket setup
     useEffect(() => {
          socket.current = io("http://localhost:5000");

          socket.current.on("receiveMessage", (data) => {
               setMessages((prev) => [...prev, data]);
          });

          return () => socket.current.disconnect();
     }, []);

     const sendMessage = async () => {
          if (!text.trim()) return;

          try {
               const res = await API.post("/messages", {
                    receiverId: id,
                    text
               });

               // ❌ REMOVE THIS LINE (important)
               // setMessages((prev) => [...prev, res.data]);

               // ✅ Only emit
               socket.current.emit("sendMessage", res.data);

               setText("");

          } catch (err) {
               console.error(err);
          }
     };

     return (
          <div className="min-h-screen bg-gray-100 flex flex-col p-4">

               {/* Chat Messages */}
               <div className="flex-1 overflow-y-auto flex flex-col gap-3 mb-4">

                    {messages.length === 0 && (
                         <p className="text-center text-gray-400">
                              No messages yet
                         </p>
                    )}

                    {messages.map((msg) => (
                         <div
                              key={msg._id}
                              className={`p-3 rounded-lg max-w-xs ${msg.sender === user?._id
                                   ? "bg-indigo-600 text-white self-end"
                                   : "bg-gray-300 self-start"
                                   }`}
                         >
                              {msg.text}
                         </div>
                    ))}

               </div>

               {/* Input */}
               <div className="flex gap-2">
                    <input
                         value={text}
                         onChange={(e) => setText(e.target.value)}
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