const express = require("express");
const Student = require("../models/Student");
const router = express.Router();

// ✅ Middleware to check authentication
const authenticateUser = (req, res, next) => {
  const { employeeNo } = req.body || req.params;

  if (!employeeNo) {
    return res.status(401).json({ message: "Unauthorized: No employee number provided" });
  }

  req.employeeNo = employeeNo;
  next();
};

// ✅ Get all students (only the logged-in teacher can view their students)
router.get("/all/:employeeNo", authenticateUser, async (req, res) => {
  try {
    const { employeeNo } = req.params;

    const students = await Student.find({ employeeNo });

    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json({ students });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
