const express = require("express");
const Class = require("../models/Class"); // ✅ Ensure Class schema exists
const router = express.Router();

// ✅ Add a student to the class collection
router.post("/add-student", async (req, res) => {
  try {
    const { userId, fullName, age, gender, gradeLevel, parentEmail, profileImage } = req.body;

    if (!userId || !fullName || !age || !gender || !gradeLevel || !parentEmail) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔹 Find class for the user
    let userClass = await Class.findOne({ userId });

    // 🔹 If no class exists, create one
    if (!userClass) {
      userClass = new Class({ userId, students: [] });
    }

    // 🔹 Add student to the class
    const newStudent = { fullName, age, gender, gradeLevel, parentEmail, profileImage, stars: 0 };
    userClass.students.push(newStudent);

    // 🔹 Save to database
    await userClass.save();

    res.status(201).json({ message: "Student added successfully!", student: newStudent });

  } catch (error) {
    console.error("❌ Error adding student:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get all students from the class collection
router.get("/get-students", async (req, res) => {
  try {
    const allClasses = await Class.find(); // 🔹 Retrieves all class documents
    let allStudents = [];

    allClasses.forEach((cls) => {
      allStudents = [...allStudents, ...cls.students];
    });

    res.status(200).json({ students: allStudents });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
