import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// Register user
export const register = async (req, res) => {
     try {
          const { name, email, password } = req.body;

          const hashedPassword = await bcrypt.hash(password, 10);

          const user = await User.create({
               name,
               email,
               password: hashedPassword
          });

          res.json(user);
     } catch (err) {
          res.status(500).json(err.message);
     }
};

// Login user
export const login = async (req, res) => {
     try {
          const { email, password } = req.body;

          const user = await User.findOne({ email });

          if (!user) return res.status(400).json("User not found");

          const isMatch = await bcrypt.compare(password, user.password);

          if (!isMatch) return res.status(400).json("Invalid credentials");

          const token = jwt.sign(
               { id: user._id },
               process.env.JWT_SECRET
          );

          res.json({
               token,
               _id: user._id,
               name: user.name,
               email: user.email,
               skillsHave: user.skillsHave,
               skillsWant: user.skillsWant,
               profilePic: user.profilePic
          });

     } catch (err) {
          res.status(500).json(err.message);
     }
};