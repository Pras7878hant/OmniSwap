import express from "express";
import { protect } from "../middleware/auth.js";
import { updateSkills, getMatches } from "../controllers/userController.js";
import User from "../models/User.js";
import multer from "multer";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.put("/skills", protect, updateSkills);
router.get("/matches", protect, getMatches);

router.post("/upload", protect, upload.single("image"), async (req, res) => {
     try {
          const base64 = req.file.buffer.toString("base64");
          const mime = req.file.mimetype;
          const image = `data:${mime};base64,${base64}`;

          const user = await User.findByIdAndUpdate(
               req.user.id,
               { profilePic: image },
               { new: true }
          );

          res.json(user);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

// Update user name
router.put("/name", protect, async (req, res) => {
     try {
          const { name } = req.body;

          if (!name) {
               return res.status(400).json({ message: "Name cannot be empty" });
          }

          const user = await User.findByIdAndUpdate(
               req.user.id,
               { name },
               { new: true }
          );

          res.json(user);
     } catch (err) {
          res.status(500).json(err.message);
     }
});

// Delete user account
router.delete("/delete", protect, async (req, res) => {
     try {
          await User.findByIdAndDelete(req.user.id);
          res.json({ message: "Account deleted successfully" });
     } catch (err) {
          res.status(500).json(err.message);
     }
});

export default router;