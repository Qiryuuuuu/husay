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

    console.log("📊 Fetched all students for dashboard:", students.length);
    res.json({ students });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching studentaaas." });
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
    const { studentId, subject, element, correct, incorrect, starsEarned } = req.body;

    if (!studentId || !subject || !element || correct === undefined || incorrect === undefined || starsEarned === undefined) {
      console.error("❌ Missing required fields:", req.body);
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      console.error("❌ Student not found:", studentId);
      return res.status(404).json({ message: "Student not found" });
    }

    console.log(`🔄 Updating scores for ${student.fullName}:`, { subject, element, correct, incorrect });

    // ✅ Update Scores (Correct, Incorrect, Percentage)
    if (student.subjects[subject] && student.subjects[subject][element]) {
      student.subjects[subject][element].correct += correct;
      student.subjects[subject][element].incorrect += incorrect;
    }

    // ✅ Update Stars
    student.stars.totalStars += starsEarned;
    console.log("🌟 Updated stars:", student.stars.totalStars);

    // ✅ Update Game Time (sessionStart, sessionEnd, timeSpent, timeLeft)
    const now = new Date();
    const formattedNow = formatDate(now);

    if (student.gameTime.sessionStart) {
      const sessionMinutes = Math.floor(
        (now - new Date(student.gameTime.sessionStart.split("|")[0])) / 60000
      );
      student.gameTime.timeSpent = Math.min(60, student.gameTime.timeSpent + sessionMinutes);
      student.gameTime.timeLeft = Math.max(0, 60 - student.gameTime.timeSpent);
      student.gameTime.sessionEnd = formattedNow;
      console.log("⏳ Updated game time:", student.gameTime);
    } else {
      student.gameTime.sessionStart = formattedNow;
    }

    // ✅ Update Attendance (Mark as Present if playing)
    const todayDateOnly = formattedNow.split(" | ")[0];
    const existingAttendance = student.attendance.find(att => att.date.startsWith(todayDateOnly));

    if (!existingAttendance) {
      student.attendance.push({ date: formattedNow, status: "Present" });
      console.log("✅ Marked attendance as Present for:", formattedNow);
    }

    // ✅ Calculate Stats and Recommendations
    student.calculateStats();
    student.calculateRecommendations();

    console.log("📊 Updated student stats:", student.accuracy);
    console.log("🔄 Updated recommendations:", student.recommendations);

    await student.save();

    res.status(200).json({ message: "Score updated successfully", student });
  } catch (error) {
    console.error("❌ Error updating score:", error);
    res.status(500).json({ message: "Server error updating score" });
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
      console.error("❌ Unauthorized deletion attempt for student:", studentId);
      return res.status(403).json({ message: "Unauthorized: You do not have permission to delete this student." });
    }

    classWithStudent.students = classWithStudent.students.filter((id) => id.toString() !== studentId);
    await classWithStudent.save();

    await Student.findByIdAndDelete(studentId);

    console.log("🗑️ Student deleted successfully:", studentId);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ message: "Server error deleting student" });
  }
});

// ✅ Fetch a Single Student's Full Data
router.get("/get/:studentId", authenticateUser, async (req, res) => {
  try {
    let student = await Student.findById(req.params.studentId).select(
      "fullName age gender stars subjects recommendations attendance gameTime accuracy"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    console.log("🔍 Fetching student data:", student.fullName);

    // ✅ Ensure data is updated before returning
    student.markAbsentIfNoPlay();
    student.updateGameTime();
    student.calculateStats();
    student.calculateRecommendations();

    await student.save();

    // ✅ Fetch latest student data
    student = await Student.findById(req.params.studentId).select(
      "fullName age gender stars subjects recommendations attendance gameTime accuracy"
    );

    console.log("✅ Updated Student Data:", student);
    res.json({ student });
  } catch (error) {
    console.error("❌ Error fetching student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Function to format date/time
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

  const formattedDate = date.toLocaleDateString("en-US", options).replace(/\//g, "-");
  const formattedTime = date.toLocaleTimeString("en-US", options);

  return `Date: ${formattedDate} | Time: ${formattedTime}`;
}

module.exports = router;
