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

    token = token.split(" ")[1]; // ✅ Extract actual token
    console.log("🔹 Extracted Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 Decoded Token Data:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.error("❌ User not found for token.");
        return res.status(404).json({ message: "User not found." });
      }

      req.user = { id: user._id, employeeNo: user.employeeNo };
      next();
    } catch (verifyError) {
      console.error("❌ JWT Verification Error:", verifyError);
      if (verifyError.name === "TokenExpiredError") {
        return res.status(401).json({ message: "Token has expired. Please log in again." });
      }
      return res.status(403).json({ message: "Invalid token." });
    }
  } catch (error) {
    console.error("❌ General Token Verification Failed:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};

// ✅ Fetch the Logged-in User's Data
router.get("/user", authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      employeeNo: user.employeeNo,
      phoneNumber: user.phoneNumber || "", // ✅ Ensure phoneNumber is included
      profilePic: user.profilePic || null,
    });
  } catch (error) {
    console.error("❌ Error fetching user:", error);
    res.status(500).json({ message: "Server error." });
  }
});



// ✅ User Registration (Sign Up)
router.post("/signup", async (req, res) => {
  try {
    const { email, phoneNumber, fullName, employeeNo, password, securityQuestions } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email Address already in use." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      email,
      phoneNumber,
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

    // ✅ Find user by email
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    // ✅ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: user._id, employeeNo: user.employeeNo }, // ✅ Ensure employeeNo is included in token payload
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // ✅ Return token and user details
    res.json({ token, userID: user._id, employeeNo: user.employeeNo });
  } catch (error) {
    console.error("❌ Sign-in Error:", error);
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

// ✅ Get Total Number of Students Assigned to User
router.get("/count", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;
    const studentCount = await Student.countDocuments({ employeeNo });

    res.json({ count: studentCount });
  } catch (error) {
    console.error("❌ Error fetching student count:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// 
router.put("/update", authenticateUser, async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    console.log("🔹 Received Update Request:", req.body); // ✅ Log incoming request

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    await user.save();

    res.json({ message: "User updated successfully." });
  } catch (error) {
    console.error("❌ Server Error:", error); // ✅ Log full server error
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});




module.exports = router;
