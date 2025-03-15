const express = require("express");
const Student = require("../models/Student");
const Class = require("../models/Class"); // ✅ Import Class model
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
    console.log("🔍 Fetching students for employeeNo:", req.user.employeeNo);

    const students = await Student.find({ employeeNo: req.user.employeeNo }).select("fullName age gender gamesPlayed attendance");

    console.log("🔹 Students fetched:", JSON.stringify(students, null, 2));

    // ✅ Ensure every student has an `attendance` array
    const updatedStudents = students.map((student) => ({
      ...student.toObject(),
      attendance: student.attendance || [],
    }));

    console.log("✅ Final API Response:", JSON.stringify(updatedStudents, null, 2));
    res.json({ students: updatedStudents });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching students." });
  }
});

// ✅ Update Student Progress
router.put("/update-attendance/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { gamesPlayed } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Determine attendance status
    const status = gamesPlayed > 0 ? "Present" : "Absent";

    // ✅ Check if an attendance record for today already exists
    const existingRecord = student.attendance.find(
      (att) => new Date(att.date).toISOString().split("T")[0] === today
    );      

    if (existingRecord) {
      existingRecord.status = status; // ✅ Update existing attendance record
    } else {
      student.attendance.push({ date: new Date(today), status });
    }

    await student.save();
    res.status(200).json({ message: "Attendance updated successfully", student });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({ message: "Server error updating attendance" });
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

// ✅ Update Student Attendance Based on Gameplay
router.put("/update-attendance/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { gamesPlayed } = req.body;
    const today = new Date().toISOString().split("T")[0];

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Determine attendance status
    const status = gamesPlayed > 0 ? "Present" : "Absent";

    // ✅ Check if an attendance record for today already exists
    const existingRecord = student.attendance.find(
      (att) => new Date(att.date).toISOString().split("T")[0] === today
    );      

    if (existingRecord) {
      existingRecord.status = status; // ✅ Update existing attendance record
    } else {
      student.attendance.push({ date: new Date(today), status });
    }

    await student.save();
    res.status(200).json({ message: "Attendance updated successfully", student });
  } catch (error) {
    console.error("❌ Error updating attendance:", error);
    res.status(500).json({ message: "Server error updating attendance" });
  }
});

// ✅ Delete a Student
router.delete("/delete/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { employeeNo } = req.user; // ✅ Extract employeeNo from authenticated user

    console.log(`🗑️ Backend attempting to delete student: ${studentId}`);
    console.log(`🔹 Logged-in teacher's employeeNo: ${employeeNo}`);
    
    // ✅ Log the class that contains the student
    const classWithStudent = await Class.findOne({ students: studentId }).exec();
    console.log("🔹 Class Found:", classWithStudent);
    
    // ✅ Log the teacher assigned to the class
    if (classWithStudent.employeeNo !== employeeNo) {
      console.error("❌ Unauthorized: You do not own this class.");
      return res.status(403).json({ message: "Unauthorized: You do not have permission to delete this student." });
    }
     

    // ✅ Remove student from the class
    classWithStudent.students = classWithStudent.students.filter((id) => id.toString() !== studentId);
    await classWithStudent.save();

    // ✅ Delete student from the database
    await Student.findByIdAndDelete(studentId);

    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting student:", error);
    res.status(500).json({ message: "Server error deleting student" });
  }
});

//test route for changing a students attendance manually.
// router.put("/:studentId/attendance", async (req, res) => {
//   try {
//     const { studentId } = req.params;
//     const { date, status } = req.body;

//     // Validate input
//     if (!date || !status || !["Present", "Absent"].includes(status)) {
//       return res.status(400).json({ message: "Invalid date or status provided." });
//     }

//     console.log(`📅 Updating attendance for Student ${studentId} on ${date} as ${status}`);

//     // Find student by ID
//     const student = await Student.findById(studentId);
//     if (!student) {
//       return res.status(404).json({ message: "Student not found." });
//     }

//     // ✅ Check if the date already exists in attendance
//     const existingRecord = student.attendance.find((entry) =>
//       entry.date.toISOString().split("T")[0] === new Date(date).toISOString().split("T")[0]
//     );

//     if (existingRecord) {
//       existingRecord.status = status; // ✅ Update existing record
//     } else {
//       student.attendance.push({ date: new Date(date), status }); // ✅ Add new attendance record
//     }

//     // ✅ Save the student record with updated attendance
//     await student.save();

//     console.log("✅ Attendance updated successfully.");
//     res.status(200).json({ message: "Attendance updated successfully", student });
//   } catch (error) {
//     console.error("❌ Error updating attendance:", error);
//     res.status(500).json({ message: "Server error updating attendance." });
//   }
// });


module.exports = router;
