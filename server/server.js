import express from "express";
import http from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

//socket
const io = new Server(server, {
     cors: {
          origin: "http://localhost:5173",
          methods: ["GET", "POST"]
     }
});

//middleware
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/messages", messageRoutes);

//socket connection
io.on("connection", (socket) => {
     console.log("User connected:", socket.id);

     socket.on("sendMessage", (data) => {
          io.emit("receiveMessage", data); // broadcast
     });

     socket.on("disconnect", () => {
          console.log("User disconnected");
     });
});

mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("MongoDB Connected"))
     .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on ${PORT}`));