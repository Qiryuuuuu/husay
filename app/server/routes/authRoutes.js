const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const router = express.Router();

// User Registration (Sign Up)
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

// User Login (Sign In)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, userId: user._id });
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});


// Save security questions on first sign-in
router.post("/save-security", async (req, res) => {
    try {
      const { email, securityQuestions } = req.body;
  
      // Check if the user exists
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found." });
  
      // If security questions are already set, prevent overwriting
      if (user.securityQuestions && user.securityQuestions.length > 0) {
        return res.status(400).json({ message: "Security questions are already set." });
      }
  
      // Save security questions for the first time
      user.securityQuestions = securityQuestions;
      await user.save();
  
      res.json({ message: "Security questions saved successfully!" });
    } catch (error) {
      console.error("❌ Error saving security questions:", error);
      res.status(500).json({ message: "Server error." });
    }
  });

  // Validate security questions
  router.post("/validate-security", async (req, res) => {
    try {
      const { email, securityAnswers } = req.body;
  
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ message: "User not found." });
  
      let isValid = user.securityQuestions.every(
        (sq, index) => sq.answer.toLowerCase() === securityAnswers[index].answer.toLowerCase()
      );
  
      if (!isValid) return res.status(400).json({ message: "Security answers incorrect." });
  
      res.json({ message: "Security questions verified successfully." });
    } catch (error) {
      res.status(500).json({ message: "Server error." });
    }
  });

module.exports = router;
