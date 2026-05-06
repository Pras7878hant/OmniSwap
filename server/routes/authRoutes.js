import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import OTP from '../models/OTP.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
     }
});

router.post('/request-otp', async (req, res) => {
     const { email, type } = req.body;

     try {
          const existingUser = await User.findOne({ email });

          if (type === 'signup' && existingUser) {
               return res.status(400).json({ message: "Email already in use" });
          }
          if (type === 'reset' && !existingUser) {
               return res.status(404).json({ message: "Account not found" });
          }

          const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

          await OTP.deleteMany({ email });
          await new OTP({ email, otp: otpCode }).save();

          await transporter.sendMail({
               from: `"OmniSwap" <${process.env.EMAIL_USER}>`,
               to: email,
               subject: 'Your OmniSwap Verification Code',
               html: `
               <div style="font-family: Arial, sans-serif; padding: 20px; text-align: center;">
                   <h2 style="color: #4f46e5;">OmniSwap Verification</h2>
                   <p>Your 6-digit verification code is:</p>
                   <h1 style="letter-spacing: 5px; color: #1e293b;">${otpCode}</h1>
                   <p style="color: #64748b; font-size: 12px;">This code expires in 5 minutes.</p>
               </div>
               `
          });

          res.status(200).json({ success: true, message: "OTP Sent" });

     } catch (error) {
          res.status(500).json({ message: "Failed to send OTP", error: error.message });
     }
});

router.post('/verify-signup', async (req, res) => {
     const { name, email, password, otp } = req.body;
     try {
          const validOtp = await OTP.findOne({ email, otp });
          if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

          const hashedPassword = await bcrypt.hash(password, 10);
          const newUser = new User({ name, email, password: hashedPassword });
          await newUser.save();

          await OTP.deleteMany({ email });

          res.status(201).json({ success: true, message: "Account created" });
     } catch (error) {
          res.status(500).json({ message: "Server error during signup" });
     }
});

router.post('/reset-password', async (req, res) => {
     const { email, newPassword, otp } = req.body;
     try {
          const validOtp = await OTP.findOne({ email, otp });
          if (!validOtp) return res.status(400).json({ message: "Invalid or expired OTP" });

          const hashedPassword = await bcrypt.hash(newPassword, 10);
          await User.findOneAndUpdate({ email }, { password: hashedPassword });

          await OTP.deleteMany({ email });

          res.status(200).json({ success: true, message: "Password updated" });
     } catch (error) {
          res.status(500).json({ message: "Server error" });
     }
});

router.post('/login', async (req, res) => {
     const { email, password } = req.body;

     try {
          const user = await User.findOne({ email });
          if (!user) return res.status(404).json({ message: "User not found" });

          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

          const token = jwt.sign(
               { id: user._id, role: user.role },
               process.env.JWT_SECRET || "fallback_secret_key",
               { expiresIn: '7d' }
          );

          const { password: _, ...userWithoutPassword } = user._doc;

          res.status(200).json({
               user: userWithoutPassword,
               token
          });

     } catch (error) {
          res.status(500).json({ message: "Server error during login" });
     }
});

export default router;