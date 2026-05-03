import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

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

app.use(cors({
     origin: allowedOrigins,
     credentials: true
}));

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notes", noteRoutes);

io.on("connection", (socket) => {
     console.log("User connected:", socket.id);

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

     socket.on("disconnect", () => {
          for (let userId in users) {
               if (users[userId] === socket.id) {
                    delete users[userId];
               }
          }
          io.emit("onlineUsers", Object.keys(users));
          console.log("User disconnected");
     });
});

mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("MongoDB Connected"))
     .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));