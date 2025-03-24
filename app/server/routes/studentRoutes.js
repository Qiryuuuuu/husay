const express = require("express");
const Student = require("../models/Student");
const Class = require("../models/Class"); // ✅ Import Class model
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Get total student count for the logged-in user's class
router.get("/count", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;
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
    const students = await Student.find({ employeeNo: req.user.employeeNo }).select(
      "fullName age gender stars subjects recommendations attendance gameTime accuracy"
    );

    res.json({ students });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching students." });
  }
});

// ✅ Update Student Attendance Based on Gameplay
router.put("/update-attendance/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const now = new Date();
    const formattedNow = formatDate(now); // ✅ Format date correctly
    const todayDateOnly = formattedNow.split(" | ")[0];

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Check if attendance already exists for today
    const existingAttendance = student.attendance.find(
      (att) => att.date.startsWith(todayDateOnly)
    );

    if (!existingAttendance) {
      // ✅ Mark student as "Present" using formatted date
      student.attendance.push({ date: formattedNow, status: "Present" });
      student.gameTime.sessionStart = formattedNow;
    } else {
      // ✅ Update sessionStart but keep the original attendance time
      student.gameTime.sessionStart = formattedNow;
    }

    await student.save();
    res.status(200).json({ message: "Attendance updated successfully", student });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({ message: "Server error updating attendance" });
  }
});


// ✅ Update Student Score and Recommendations
router.put("/update-score", authenticateUser, async (req, res) => {
  try {
    const { studentId, subject, correct, incorrect } = req.body;

    if (!studentId || !subject || correct === undefined || incorrect === undefined) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Update the score
    if (student.subjects[subject]) {
      student.subjects[subject].correct += correct;
      student.subjects[subject].incorrect += incorrect;
    }

    // ✅ Recalculate accuracy and percentage
    student.calculateStats();

    // ✅ Recalculate recommendations
    student.calculateRecommendations();

    await student.save();
    
    res.status(200).json({ message: "Score updated successfully", student });
  } catch (error) {
    console.error("❌ Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
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
      { fullName, age, gender, profileImage, updatedAt: new Date() },
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

// ✅ Delete a Student and Remove from Class
router.delete("/delete/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { employeeNo } = req.user;

    const classWithStudent = await Class.findOne({ students: studentId });

    if (!classWithStudent || classWithStudent.employeeNo !== employeeNo) {
      return res.status(403).json({ message: "Unauthorized: You do not have permission to delete this student." });
    }

    // ✅ Remove student from class
    classWithStudent.students = classWithStudent.students.filter((id) => id.toString() !== studentId);
    await classWithStudent.save();

    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ message: "Server error deleting student" });
  }
});

// ✅ Fetch a Single Student's Full Data
router.get("/get/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    
    const student = await Student.findById(studentId).select(
      "fullName age gender stars subjects recommendations attendance gameTime accuracy"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

     // ✅ Recalculate accuracy before returning (ensures latest values)
     student.calculateStats();
    
     // ✅ Save the student to ensure database is updated
     await student.save();
    
     console.log("✅ Updated Student Accuracy:", student.accuracy);
     
    res.json({ student });
  } catch (error) {
    console.error("❌ Error fetching student data:", error);
    res.status(500).json({ message: "Server error fetching student" });
  }
});

module.exports = router;
