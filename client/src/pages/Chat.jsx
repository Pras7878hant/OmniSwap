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
               <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center p-4 relative overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
                    <div className="text-center text-slate-400 bg-white/5 border border-white/10 p-8 md:p-12 rounded-3xl backdrop-blur-xl max-w-md w-full shadow-2xl z-10">
                         <span className="text-6xl block mb-6 drop-shadow-2xl">💬</span>
                         <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Your Messages</h2>
                         <p className="mb-8 text-sm md:text-base">Please select a conversation from your matches to start chatting.</p>
                         <button
                              onClick={() => navigate("/matches")}
                              className="w-full bg-gradient-to-r from-indigo-600 to-fuchsia-600 hover:from-indigo-500 hover:to-fuchsia-500 text-white px-6 py-4 rounded-xl font-bold transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] active:scale-95"
                         >
                              Find Matches
                         </button>
                    </div>
               </div>
          );
     }

     return (
          <div className="h-[calc(100vh-76px)] bg-[#0a0f1c] text-slate-200 p-2 md:p-6 relative overflow-hidden flex flex-col">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

               <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl relative z-10 overflow-hidden">
                    <div className="bg-black/20 border-b border-white/10 p-4 md:px-6 py-4 flex justify-between items-center">
                         <div className="flex items-center gap-3">
                              <div className="relative flex items-center justify-center w-4 h-4">
                                   {onlineUsers.includes(id) ? (
                                        <>
                                             <span className="absolute w-full h-full bg-emerald-500 rounded-full animate-ping opacity-20"></span>
                                             <span className="relative w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                                        </>
                                   ) : (
                                        <span className="w-2.5 h-2.5 bg-slate-500 rounded-full"></span>
                                   )}
                              </div>
                              <span className="font-bold text-white tracking-wide text-sm md:text-base">
                                   {onlineUsers.includes(id) ? "Online" : "Offline"}
                              </span>
                         </div>

                         <button
                              onClick={openWhiteboard}
                              className="bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 px-3 py-1.5 md:px-4 md:py-2 rounded-xl text-xs md:text-sm font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95 flex items-center gap-2"
                         >
                              <span className="hidden md:inline">Shared</span> Whiteboard
                         </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 custom-scrollbar">
                         {messages.length === 0 && (
                              <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50">
                                   <span className="text-4xl mb-3">👋</span>
                                   <p className="font-medium text-sm md:text-base">Say hello to start the conversation!</p>
                              </div>
                         )}

                         {messages.map((msg, i) => (
                              <div key={msg._id} className="flex flex-col">
                                   <div
                                        className={`p-3 md:p-4 text-sm md:text-base ${msg.sender === user?._id
                                             ? "bg-indigo-600 text-white self-end ml-auto rounded-2xl rounded-br-sm shadow-[0_5px_15px_rgba(79,70,229,0.2)]"
                                             : "bg-slate-800 text-slate-200 self-start rounded-2xl rounded-bl-sm border border-white/5 shadow-md"
                                             } max-w-[85%] md:max-w-md w-fit break-words`}
                                   >
                                        {msg.text}
                                   </div>

                                   {msg.sender === user?._id && i === messages.length - 1 && (
                                        <p className="text-[10px] md:text-xs text-right mt-1.5 text-indigo-400 font-medium tracking-wide">
                                             {seen ? "Seen" : "Sent"}
                                        </p>
                                   )}
                              </div>
                         ))}

                         {typing && (
                              <div className="self-start bg-slate-800/50 border border-white/5 rounded-2xl rounded-bl-sm p-4 w-fit shadow-md">
                                   <div className="flex gap-1.5 items-center h-2">
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                   </div>
                              </div>
                         )}
                    </div>

                    <div className="bg-black/40 border-t border-white/10 p-3 md:p-4 flex gap-2 md:gap-3 items-center">
                         <input
                              value={text}
                              onChange={handleTyping}
                              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 md:p-4 text-white placeholder:text-slate-500 focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm md:text-base"
                              placeholder="Type your message..."
                         />
                         <button
                              onClick={sendMessage}
                              className="bg-indigo-600 hover:bg-indigo-500 text-white p-3 md:px-8 md:py-4 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] active:scale-95 flex items-center justify-center"
                         >
                              <span className="hidden md:inline">Send</span>
                              <svg className="w-5 h-5 md:hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                         </button>
                    </div>
               </div>
          </div>
     );
};

export default Chat;