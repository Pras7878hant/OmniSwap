import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import API from "../services/api";

const Chat = () => {
     const { id } = useParams();
     const [messages, setMessages] = useState([]);
     const [text, setText] = useState("");
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
          socket.current = io("http://localhost:5000");

          socket.current.on("receiveMessage", (data) => {
               setMessages((prev) => [...prev, data]);
          });

          return () => socket.current.disconnect();
     }, []);

     const sendMessage = async () => {
          if (!text.trim()) return;

          const newMessage = {
               receiverId: id,
               text
          };

          try {
               const res = await API.post("/messages", newMessage);

               setMessages((prev) => [...prev, res.data]);

               socket.current.emit("sendMessage", res.data);

               setText("");
          } catch (err) {
               console.error(err);
          }
     };

     return (
          <div className="min-h-screen bg-gray-100 flex flex-col p-4">
               <div className="flex-1 overflow-y-auto space-y-3 mb-4 flex flex-col">
                    {messages.map((msg) => (
                         <div
                              key={msg._id}
                              className={`p-3 rounded-lg max-w-xs ${msg.sender === id
                                        ? "bg-gray-300 self-start"
                                        : "bg-indigo-600 text-white self-end"
                                   }`}
                         >
                              {msg.text}
                         </div>
                    ))}
               </div>

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