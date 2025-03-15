const express = require("express");
const Class = require("../models/Class");
const Student = require("../models/Student");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add a student (Creates class if none exists)
router.post("/add-student", authenticateUser, async (req, res) => { 
  try {
    const { fullName, age, gender, profileImage } = req.body;

    if (!req.user || !req.user.employeeNo) {
      return res.status(403).json({ message: "Unauthorized: Employee number is missing." });
    }

    const employeeNo = req.user.employeeNo;

    if (!fullName || !age || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let userClass = await Class.findOne({ employeeNo }).populate("students");

    if (!userClass) {
      userClass = new Class({
        employeeNo,
        students: [],
        subjects: ["Colors", "Shapes", "Numbers"], // ✅ Add default subjects
      });
      await userClass.save();
    }

    const newStudent = new Student({
      fullName,
      age,
      gender,
      profileImage,
      employeeNo,
      subjects: {
        Colors: { Easy: 0, Medium: 0, Hard: 0 },
        Shapes: { Easy: 0, Medium: 0, Hard: 0 },
        Numbers: { Easy: 0, Medium: 0, Hard: 0 },
      },
    });

    await newStudent.save();
    userClass.students.push(newStudent);
    await userClass.save();

    res.status(201).json({ message: "Student added successfully!", student: newStudent });

  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// ✅ Fetch students along with subjects and progress
router.get("/get-students", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;

    const userClass = await Class.findOne({ employeeNo }).populate({
      path: "students",
      model: "Student",
      select: "fullName profileImage stars subjects",
    });

    if (!userClass) {
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({ students: userClass.students });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
