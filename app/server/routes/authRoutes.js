const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");
const Class = require("../models/Class");
require("dotenv").config();

const router = express.Router();

// ✅ Middleware to Verify Token and Fetch User
const authenticateUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (!token || !token.startsWith("Bearer ")) {
      console.error("❌ Unauthorized Access Attempt: Token Missing or Invalid");
      return res
        .status(401)
        .json({ message: "Unauthorized: Token is missing or invalid." });
    }

    token = token.split(" ")[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.error("❌ Token Verification Failed: User Not Found");
        return res.status(404).json({ message: "User not found." });
      }

      req.user = { id: user._id, employeeNo: user.employeeNo };
      next();
    } catch (verifyError) {
      console.error("❌ JWT Verification Error:", verifyError);
      if (verifyError.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token has expired. Please log in again." });
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
      console.error("❌ User Fetch Failed: User Not Found");
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      id: user._id,
      fullName: user.fullName,
      employeeNo: user.employeeNo,
      phoneNumber: user.phoneNumber || "",
      profilePic: user.profilePic || null,
    });
  } catch (error) {
    console.error("❌ Error Fetching User:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ User Registration (Sign Up)
// ✅ User Registration (Sign Up)
router.post("/signup", async (req, res) => {
  try {
    const {
      email,
      phoneNumber,
      fullName,
      employeeNo,
      password,
      securityQuestions,
    } = req.body;

    // ✅ Check if email ends with @plm.edu.ph
    if (!email.toLowerCase().endsWith("@plm.edu.ph")) {
      console.error("❌ Signup Error: Invalid Email Domain");
      return res.status(400).json({
        message: "Only emails with the @plm.edu.ph domain are allowed.",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.error("❌ Signup Error: Email Already in Use");
      return res
        .status(400)
        .json({ message: "Email Address already in use." });
    }

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
    console.error("❌ Signup Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});


// ✅ User Login (Sign In)
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.error("❌ Login Error: Invalid Credentials");
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error("❌ Login Error: Incorrect Password");
      return res.status(400).json({ message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: user._id, employeeNo: user.employeeNo },
      process.env.JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.json({ token, userID: user._id, employeeNo: user.employeeNo });
  } catch (error) {
    console.error("❌ Login Error:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Save Security Questions on First Sign-In
router.post("/save-security", async (req, res) => {
  try {
    const { email, securityQuestions } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      console.error("❌ Security Question Error: User Not Found");
      return res.status(400).json({ message: "User not found." });
    }

    if (user.securityQuestions && user.securityQuestions.length > 0) {
      return res
        .status(400)
        .json({ message: "Security questions are already set." });
    }

    user.securityQuestions = securityQuestions;
    await user.save();

    res.json({ message: "Security questions saved successfully!" });
  } catch (error) {
    console.error("❌ Error Saving Security Questions:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Validate Security Questions
router.post("/validate-security", async (req, res) => {
  try {
    const { email, securityAnswers } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found." });
    }

    if (!securityAnswers || securityAnswers.length === 0) {
      return res.status(400).json({ message: "Security answers are required." });
    }

    const { question, answer } = securityAnswers[0];
    const match = user.securityQuestions.find(
      (sq) =>
        sq.question === question &&
        sq.answer.toLowerCase() === answer.toLowerCase()
    );

    if (!match) {
      return res.status(400).json({ message: "Security answer is incorrect." });
    }

    return res.json({ message: "Security questions verified successfully." });
  } catch (error) {
    console.error("❌ Error Validating Security Questions:", error);
    return res.status(500).json({ message: "Server error." });
  }
});


// ✅ Fetch user's security questions by email
router.post("/user/security-questions", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user || !user.securityQuestions || user.securityQuestions.length === 0) {
      return res.status(404).json({ success: false, message: "No security questions found." });
    }

    const questions = user.securityQuestions.map((q) => ({
      question: q.question,
    }));

    res.json({ success: true, questions });
  } catch (err) {
    console.error("❌ Error fetching security questions:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Get Total Number of Students Assigned to User (Optimized)
router.get("/count", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;

    const userClass = await Class.findOne({ employeeNo }).populate("students");
    if (!userClass) {
      return res.status(200).json({ count: 0 });
    }

    res.json({ count: userClass.students.length });
  } catch (error) {
    console.error("❌ Error Fetching Student Count:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Update User Information
router.put("/update", authenticateUser, async (req, res) => {
  try {
    const { fullName, phoneNumber } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      console.error("❌ User Update Error: User Not Found");
      return res.status(404).json({ message: "User not found." });
    }

    if (fullName) user.fullName = fullName;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    user.updatedAt = formatDate(new Date()); // ✅ Ensure `updatedAt` updates when the user updates their info.

    await user.save();

    res.json({ message: "User updated successfully." });
  } catch (error) {
    console.error("❌ Error Updating User:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Reset Password via Phone (Firebase SMS flow)
router.post("/reset-password-sms", async (req, res) => {
  try {
    let { phoneNumber, newPassword } = req.body;

    if (!phoneNumber || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing phone or password." });
    }

    // Strip +63 or 0 to match DB format (e.g., 9066041979)
    if (phoneNumber.startsWith("+63")) {
      phoneNumber = phoneNumber.replace("+63", "");
    } else if (phoneNumber.startsWith("09")) {
      phoneNumber = phoneNumber.slice(1); // removes leading "0"
    }

    const user = await User.findOne({ phoneNumber });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Reset password error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Reset Password via Email (Security Question Flow)
router.post("/reset-password-email", async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing email or password." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("❌ Reset password (email) error:", err);
    return res.status(500).json({ success: false, message: "Server error." });
  }
});

// ✅ Function to format Date and Time in required format (YYYY-MM-DD | HH:MM:SS AM/PM)
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  // Convert date to YYYY-MM-DD format
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(/\//g, "-");
  const formattedTime = date.toLocaleTimeString("en-US", options);

  return `Date: ${formattedDate} | Time: ${formattedTime}`;
}

module.exports = router;
