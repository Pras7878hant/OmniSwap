import express from "express";
import { protect } from "../middleware/auth.js";
import Message from "../models/Message.js";

const router = express.Router();

// send msg
router.post("/", protect, async (req, res) => {
     try {
          const { receiverId, text } = req.body;

          const message = await Message.create({
               sender: req.user.id,
               receiver: receiverId,
               text
          });

          res.json(message);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

// get msggg
router.get("/:userId", protect, async (req, res) => {
     try {
          const messages = await Message.find({
               $or: [
                    { sender: req.user.id, receiver: req.params.userId },
                    { sender: req.params.userId, receiver: req.user.id }
               ]
          }).sort({ createdAt: 1 });

          res.json(messages);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

export default router;