import 'dotenv/config';
import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import Roadmap from "./models/Roadmap.js";

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
     "http://localhost:5173",
     "https://omni-swap-brown.vercel.app",
     "https://omni-swap-git-main-pras7878hants-projects.vercel.app"
];

const io = new Server(server, {
     cors: {
          origin: allowedOrigins,
          methods: ["GET", "POST"],
          credentials: true
     }
});

const users = {};

// MIDDLEWARE
app.use(cors({
     origin: allowedOrigins,
     credentials: true
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notes", noteRoutes);

// NEW ROADMAP SAVE ROUTE
app.post("/api/roadmaps/save", async (req, res) => {
     try {
          const { title, nodes, edges, isPublic } = req.body;

          const newRoadmap = new Roadmap({
               title,
               nodes,
               edges,
               isPublic
          });

          const savedRoadmap = await newRoadmap.save();

          res.status(201).json({
               success: true,
               message: "Roadmap saved successfully!",
               roadmap: savedRoadmap
          });

     } catch (error) {
          console.error("Database Save Error:", error);
          res.status(500).json({ success: false, message: "Server error saving roadmap" });
     }
});

// SOCKET.IO
io.on("connection", (socket) => {
     // console.log("User connected:", socket.id);

     socket.on("join", (userId) => {
          users[userId] = socket.id;
          io.emit("onlineUsers", Object.keys(users));
     });

     socket.on("sendMessage", (message) => {
          const receiverSocket = users[message.receiver];
          if (receiverSocket) {
               io.to(receiverSocket).emit("receiveMessage", message);
          }
     });

     socket.on("typing", ({ sender, receiver }) => {
          const receiverSocket = users[receiver];
          if (receiverSocket) {
               io.to(receiverSocket).emit("typing", sender);
          }
     });

     socket.on("seen", ({ sender, receiver }) => {
          const senderSocket = users[receiver];
          if (senderSocket) {
               io.to(senderSocket).emit("seen", sender);
          }
     });

     // Whiteboard
     socket.on("join-room", (roomId) => {
          socket.join(roomId);
     });

     socket.on("send-drawing", ({ roomId, elements }) => {
          socket.to(roomId).emit("receive-drawing", { elements });
     });

     socket.on("disconnect", () => {
          for (let userId in users) {
               if (users[userId] === socket.id) {
                    delete users[userId];
               }
          }
          io.emit("onlineUsers", Object.keys(users));
          // console.log("User disconnected");
     });
});


mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("MongoDB Connected"))
     .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));