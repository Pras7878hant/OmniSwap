import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
     userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
     },
     title: String,
     content: String,
     skill: String,
     type: String,
     link: String,

     likes: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
     }],

     comments: [
          {
               userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User"
               },
               text: String,
               createdAt: { type: Date, default: Date.now }
          }
     ]

}, { timestamps: true });

export default mongoose.model("Note", noteSchema);