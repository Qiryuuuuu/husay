const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// ✅ Middleware to Verify Token and Fetch User
const authenticateUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token is missing or invalid." });
    }

    token = token.split(" ")[1]; // Remove "Bearer " from token
    console.log("🔹 Decoding Token:", token); // ✅ Debugging output

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    req.user = user; // Store user data in request
    next();
  } catch (error) {
    console.error("❌ Token Verification Failed:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};

// ✅ Fetch the Logged-in User's Data
router.get("/user", authenticateUser, async (req, res) => {
  try {
    res.status(200).json(req.user); // Send user data
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ User Registration (Sign Up)
router.post("/signup", async (req, res) => {
  try {
    const { email, fullName, employeeNo, password, securityQuestions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      fullName,
      employeeNo,
      password: hashedPassword,
      securityQuestions,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ User Login (Sign In) - Now Returns `employeeNo`
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Return `employeeNo` along with token
    res.json({ token, userId: user._id, employeeNo: user.employeeNo });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
