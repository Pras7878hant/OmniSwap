import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";


dotenv.config();

const app = express();

// Middleware
app.use(cors({
     origin: "http://localhost:5173",
     credentials: true
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

// Test route
app.get("/", (req, res) => {
     res.send("Running...");
});


mongoose.connect(process.env.MONGO_URI)
     .then(() => console.log("MongoDB Connected"))
     .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));