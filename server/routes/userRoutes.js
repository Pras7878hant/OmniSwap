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

export default router;