const express = require("express");
const Student = require("../models/Student");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get total student count for the logged-in user's class
router.get("/count", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo; // Get employeeNo from the token
    if (!employeeNo) {
      return res.status(400).json({ message: "Employee number is missing." });
    }

    const studentCount = await Student.countDocuments({ employeeNo });
    res.json({ count: studentCount });
  } catch (error) {
    console.error("❌ Error fetching student count:", error);
    res.status(500).json({ message: "Server error." });
  }
});

// ✅ Get all students for the authenticated teacher
router.get("/all", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;

    const students = await Student.find({ employeeNo }).select("fullName gamesPlayed");

    if (!students.length) {
      return res.status(404).json({ message: "No students found" });
    }

    res.status(200).json({ students });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


// ✅ Update Student Progress
router.put("/update-progress/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { subject, difficulty, score } = req.body;

    if (!subject || !difficulty || score === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (!student.subjects[subject]) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    student.subjects[subject][difficulty] = score;
    await student.save();

    res.status(200).json({ message: "Progress updated", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Edit Student Information
router.put("/edit/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fullName, age, gender, profileImage } = req.body;

    if (!fullName || !age || !gender) {
      return res.status(400).json({ message: "Full Name, Age, and Gender are required." });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { fullName, age, gender, profileImage },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student information updated successfully", student: updatedStudent });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ Mark Student Attendance
router.put("/update-attendance/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { date, status } = req.body;

    if (!date || !status) {
      return res.status(400).json({ message: "Date and status are required." });
    }

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Invalid status." });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Check if the date already exists
    const existingRecord = student.attendance.find(
      (att) => att.date.toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
    );

    if (existingRecord) {
      existingRecord.status = status;
    } else {
      student.attendance.push({ date: new Date(date), status });
    }

    await student.save();
    res.status(200).json({ message: "Attendance updated", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
