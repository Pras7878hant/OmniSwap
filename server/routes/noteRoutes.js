import express from "express";
import { protect } from "../middleware/auth.js";
import Note from "../models/Note.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
     try {
          const note = await Note.create({
               userId: req.user.id,
               ...req.body,
               skill: req.body.skill.toLowerCase().trim()
          });

          res.json(note);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

router.get("/matched", protect, async (req, res) => {
     try {
          const currentUser = await User.findById(req.user.id);

          const skills = [
               ...(currentUser.skillsHave || []),
               ...(currentUser.skillsWant || [])
          ].map(s => s.toLowerCase().trim());

          const notes = await Note.find({
               $expr: {
                    $in: [
                         { $toLower: "$skill" },
                         skills
                    ]
               }
          })
               .populate("userId", "name profilePic")
               .populate("comments.userId", "name");

          res.json(notes);

     } catch (err) {
          res.status(500).json(err.message);
     }
});

router.put("/:id", protect, async (req, res) => {
     try {
          const note = await Note.findById(req.params.id);

          if (!note) return res.status(404).json("Not found");
          if (note.userId.toString() !== req.user.id)
               return res.status(403).json("Unauthorized");

          Object.assign(note, req.body);
          if (req.body.skill) {
               note.skill = req.body.skill.toLowerCase().trim();
          }

          await note.save();

          const updated = await Note.findById(note._id)
               .populate("userId", "name profilePic")
               .populate("comments.userId", "name");

          res.json(updated);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

router.delete("/:id", protect, async (req, res) => {
     try {
          const note = await Note.findById(req.params.id);

          if (!note) return res.status(404).json("Not found");
          if (note.userId.toString() !== req.user.id)
               return res.status(403).json("Unauthorized");

          await note.deleteOne();
          res.json("Deleted");
     } catch (err) {
          res.status(500).json(err.message);
     }
});

router.put("/:id/like", protect, async (req, res) => {
     try {
          const note = await Note.findById(req.params.id);

          const alreadyLiked = note.likes.includes(req.user.id);

          if (alreadyLiked) {
               note.likes = note.likes.filter(
                    (id) => id.toString() !== req.user.id
               );
          } else {
               note.likes.push(req.user.id);
          }

          await note.save();

          const updated = await Note.findById(note._id)
               .populate("userId", "name profilePic")
               .populate("comments.userId", "name");

          res.json(updated);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

router.post("/:id/comment", protect, async (req, res) => {
     try {
          const note = await Note.findById(req.params.id);

          note.comments.push({
               userId: req.user.id,
               text: req.body.text
          });

          await note.save();

          const updated = await Note.findById(note._id)
               .populate("userId", "name profilePic")
               .populate("comments.userId", "name");

          res.json(updated);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

export default router;