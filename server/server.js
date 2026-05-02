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
console.log("JWT:", process.env.JWT_SECRET);
console.log("MONGO:", process.env.MONGO_URI);
const app = express();
const server = http.createServer(app);

// socket setup
const io = new Server(server, {
     cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"]
     }
});

// this will store which user is connected to which socket
const users = {};


app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/notes", noteRoutes);

io.on("connection", (socket) => {
     console.log("User connected:", socket.id);

     // user opens app, map userId with socketId
     socket.on("join", (userId) => {
          users[userId] = socket.id;

          // updated online users list to everyone
          io.emit("onlineUsers", Object.keys(users));
     });

     // when someone sends message
     socket.on("sendMessage", (message) => {
          const receiverSocket = users[message.receiver];

          // send message only to receiver
          if (receiverSocket) {
               io.to(receiverSocket).emit("receiveMessage", message);
          }
     });

     // typing indicator
     socket.on("typing", ({ sender, receiver }) => {
          const receiverSocket = users[receiver];

          if (receiverSocket) {
               io.to(receiverSocket).emit("typing", sender);
          }
     });

     // seen message
     socket.on("seen", ({ sender, receiver }) => {
          const senderSocket = users[receiver];

          if (senderSocket) {
               io.to(senderSocket).emit("seen", sender);
          }
     });

     // when user disconnects
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