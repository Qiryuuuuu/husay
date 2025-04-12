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
      return res
        .status(403)
        .json({ message: "Unauthorized: Employee number is missing." });
    }

    const employeeNo = req.user.employeeNo;

    if (!fullName || !age || !gender) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let userClass = await Class.findOne({ employeeNo }).populate("students");

    const existingStudent = userClass?.students.find(
      (student) => student.fullName === fullName
    );
    if (existingStudent) {
      return res
        .status(400)
        .json({ message: "A student with this name already exists." });
    }

    if (!userClass) {
      userClass = new Class({
        employeeNo,
        students: [],
        subjects: [
          { name: "Colors" },
          { name: "Shapes" },
          { name: "Numbers" },
        ], // ✅ Default subjects
      });
      await userClass.save();
    }

    // ✅ Initialize New Student Object
    const newStudent = new Student({
      fullName,
      age,
      gender,
      profileImage,
      employeeNo,

      // ✅ Initialize Subjects with Default Scores
      subjects: {
        Shapes: { Rectangle: {}, Triangle: {}, Circle: {}, Square: {} },
        Colors: {
          Red: {},
          Yellow: {},
          Green: {},
          Blue: {},
          Black: {},
          Gray: {},
          White: {},
        },
        Numbers: {
          One: {},
          Two: {},
          Three: {},
          Four: {},
          Five: {},
          Six: {},
          Seven: {},
          Eight: {},
          Nine: {},
          Ten: {},
        },
      },

      // ✅ Initialize Stars
      stars: {
        totalStars: 0,
      },

      // ✅ Initialize Recommendations
      recommendations: {
        Easy: { Shapes: [], Colors: [], Numbers: [] },
        Medium: { Mixed: [] },
        Hard: { Shapes: [], Colors: [], Numbers: [] },
      },

      // ✅ Initialize Attendance
      attendance: [],

      // ✅ Initialize Game Time Tracking
      gameTime: {
        timeSpent: 0,
        timeLeft: 60,
        sessionStart: null,
        sessionEnd: null,
      },

      createdAt: formatDate(new Date()), // ✅ Correct date format
      updatedAt: formatDate(new Date()), // ✅ Correct date format
    });

    await newStudent.save();
    userClass.students.push(newStudent);
    await userClass.save();

    res
      .status(201)
      .json({ message: "Student added successfully!", student: newStudent });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

// ✅ Fetch students along with subjects, stars, recommendations, attendance, and game time
router.get("/get-students", authenticateUser, async (req, res) => {
  try {
    const employeeNo = req.user.employeeNo;

    const userClass = await Class.findOne({ employeeNo }).populate({
      path: "students",
      model: "Student",
      select:
        "fullName profileImage stars subjects attendance recommendations gameTime accuracy updatedAt",
    });

    if (!userClass) {
      return res.status(200).json({ students: [] });
    }

    res.status(200).json({ students: userClass.students });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error: error.message });
  }
});

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
