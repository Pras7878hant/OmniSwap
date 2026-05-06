import mongoose from "mongoose";

const roadmapSchema = new mongoose.Schema({

     title: { type: String, required: true },
     isPublic: { type: Boolean, default: false },

     nodes: { type: Array, required: true },
     edges: { type: Array, required: true },

     likes: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Roadmap', roadmapSchema);