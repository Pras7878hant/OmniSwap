import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
     name: String,
     email: { type: String, unique: true },
     password: String,
     skillsHave: [String],
     skillsWant: [String],
     rating: { type: Number, default: 0 },
     profilePic: String
}, { timestamps: true });

export default mongoose.model("User", userSchema);