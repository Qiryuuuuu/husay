const express = require("express");
const Class = require("../models/Class");
const Student = require("../models/Student");
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Add a student (Creates class if none exists)
router.post("/add-student", authenticateUser, async (req, res) => { 
  try {
    const { fullName, age, gender, profileImage } = req.body;

    // ✅ Check if user is authenticated and has employeeNo
    if (!req.user || !req.user.employeeNo) {
      console.error("❌ Unauthorized: Employee number is missing.");
      return res.status(403).json({ message: "Unauthorized: Employee number is missing." });
    }

    const employeeNo = req.user.employeeNo; 
    console.log("🔹 Adding student for employeeNo:", employeeNo);

    // ✅ Validate required fields
    if (!fullName || !age || !gender) {
      console.error("❌ Validation Error: Missing fields.");
      return res.status(400).json({ message: "All fields are required." });
    }

    // 🔹 Find or create class for the logged-in user
    let userClass = await Class.findOne({ employeeNo }).populate("students");
    console.log("🔹 Found Class:", userClass);

    // 🔹 If no class exists, create one for the employeeNo
    if (!userClass) {
      console.log("🔹 No class found. Creating class for:", employeeNo);

      userClass = new Class({
        employeeNo,
        students: [], // Start with an empty student array
      });
      await userClass.save(); // ✅ Create the class if it does not exist
      console.log("✅ Class created successfully:", userClass);
    }

    // 🔹 Create and save the new student
    const newStudent = new Student({
      fullName,
      age,
      gender,
      profileImage,
      employeeNo, // ✅ Link student to employeeNo
    });

    await newStudent.save(); 
    console.log("✅ New student saved:", newStudent);

    userClass.students.push(newStudent);
    await userClass.save();

    console.log("✅ Student added to class successfully!");
    res.status(201).json({ message: "Student added successfully!", student: newStudent });

  } catch (error) {
    console.error("❌ Error adding student:", error.message); 
    console.error(error); 
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// ✅ Get all students in a class for the logged-in teacher
router.get("/get-students", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;
    console.log("🔹 Fetching students for employeeNo:", employeeNo);

    // 🔹 Find class and populate students
    const userClass = await Class.findOne({ employeeNo }).populate({
      path: "students",
      model: "Student",
      select: "fullName profileImage stars"
    });

    console.log("🔹 User Class Found:", userClass);

    if (!userClass) {
      console.error("❌ No class found for employeeNo:", employeeNo);
      return res.status(404).json({ message: "Class not found." });
    }

    res.status(200).json({ students: userClass.students });
  } catch (error) {
    console.error("❌ Error fetching students:", error.message);
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

module.exports = router;
