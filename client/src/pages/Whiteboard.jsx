import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { socket } from "../services/socket";

const Whiteboard = () => {
     const { roomId } = useParams();
     const [excalidrawAPI, setExcalidrawAPI] = useState(null);
     const lastCanvasState = useRef("");

     useEffect(() => {
          if (!roomId || !excalidrawAPI) return;

          const joinRoom = () => {
               socket.emit("join-room", roomId);
          };

          if (socket.connected) {
               joinRoom();
          }

          socket.on("connect", joinRoom);

          const handleReceive = (data) => {
               const incomingElements = Array.isArray(data) ? data : data?.elements;

               if (!incomingElements || !Array.isArray(incomingElements)) {
                    console.error("❌ Data format error: Expected an array of elements");
                    return;
               }

               lastCanvasState.current = JSON.stringify(incomingElements);
               excalidrawAPI.updateScene({ elements: incomingElements });
          };

          socket.on("receive-drawing", handleReceive);

          return () => {
               socket.off("connect", joinRoom);
               socket.off("receive-drawing", handleReceive);
          };
     }, [roomId, excalidrawAPI]);

     const handleChange = (elements) => {
          if (!socket.connected || !elements || elements.length === 0) return;

          const currentState = JSON.stringify(elements);

          if (currentState !== lastCanvasState.current) {
               lastCanvasState.current = currentState;
               socket.emit("send-drawing", { roomId, elements });
          }
     };

     return (
          <div className="w-full h-screen bg-gray-100 p-4">
               <div className="w-full h-full bg-white rounded-2xl shadow-xl overflow-hidden">
                    <Excalidraw
                         excalidrawAPI={(api) => setExcalidrawAPI(api)}
                         onChange={handleChange}
                    />
               </div>
          </div>
     );
};

export default Whiteboard;