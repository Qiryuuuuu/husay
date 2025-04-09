const express = require("express");
const Student = require("../models/Student");
const Class = require("../models/Class"); // ✅ Import Class model
const authenticateUser = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ Function to format Date and Time in 12-hour format
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

  // Format Date: Convert to `YYYY-MM-DD`
  const formattedDate = date
    .toLocaleDateString("en-US", options)
    .replace(/\//g, "-");

  // Format Time: `HH:MM:SS AM/PM`
  const formattedTime = date.toLocaleTimeString("en-US", options);

  return `Date: ${formattedDate} | Time: ${formattedTime}`;
}

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
    const students = await Student.find({
      employeeNo: req.user.employeeNo,
    }).select(
      "fullName age gender stars subjects recommendations attendance gameTime accuracy"
    );

    res.json({ students });
  } catch (error) {
    console.error("❌ Error fetching students:", error);
    res.status(500).json({ message: "Server error fetching students." });
  }
});

// ✅ Update Student Attendance Based on Gameplay
router.put(
  "/update-attendance/:studentId",
  authenticateUser,
  async (req, res) => {
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
      const existingAttendance = student.attendance.find((att) =>
        att.date.startsWith(todayDateOnly)
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
      res
        .status(200)
        .json({ message: "Attendance updated successfully", student });
    } catch (error) {
      console.error("❌ Error updating attendance:", error);
      res.status(500).json({ message: "Server error updating attendance" });
    }
  }
);

router.put("/update-score", async (req, res) => {
  try {
    console.log("🔍 Received Data in API Request:", req.body);

    const {
      studentId,
      category: scoresByCategory,
      stars,
      rounds,
      time,
    } = req.body;

    if (!studentId || !scoresByCategory) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // ✅ Mapping for categories
    const categoryMapping = {
      shape: "Shapes",
      color: "Colors",
      number: "Numbers",
    };

    // ✅ Mapping for number subcategory
    const numberMapping = {
      1: "One",
      2: "Two",
      3: "Three",
      4: "Four",
      5: "Five",
      6: "Six",
      7: "Seven",
      8: "Eight",
      9: "Nine",
      10: "Ten",
    };

    // ✅ Update subject scores
    Object.entries(scoresByCategory).forEach(([cat, subcats]) => {
      const correctCategory = categoryMapping[cat];
      if (!correctCategory || !student.subjects[correctCategory]) return;

      Object.entries(subcats).forEach(([subcat, scoreData]) => {
        let mappedSubcat = subcat;

        if (cat === "number" && !isNaN(subcat)) {
          mappedSubcat = numberMapping[parseInt(subcat, 10)] || subcat;
        }

        if (!mappedSubcat || !student.subjects[correctCategory][mappedSubcat]) {
          return;
        }

        student.subjects[correctCategory][mappedSubcat].correct +=
          scoreData.correct;
        student.subjects[correctCategory][mappedSubcat].incorrect +=
          scoreData.incorrect;
      });
    });

    // ✅ Update total stars
    if (typeof stars === "number") {
      student.stars.totalStars += stars;
    }

    // ✅ Update Game Time
    if (typeof time === "number") {
      student.gameTime.timeSpent = Math.min(
        60,
        student.gameTime.timeSpent + time
      );
      student.gameTime.timeLeft = Math.max(0, 60 - student.gameTime.timeSpent);

      const now = new Date();
      const formattedNow = formatDate(now);

      if (student.gameTime.timeLeft === 0) {
        student.gameTime.sessionEnd = formattedNow;
      } else {
        student.gameTime.sessionStart = formattedNow;
        student.gameTime.sessionEnd = formattedNow;
      }
    }

    // ✅ Recalculate stats & recommendations (assuming you have a method on the model)
    student.calculateStats();

    await student.save();

    res.status(200).json({
      message: "Score updated successfully",
      student,
    });
  } catch (error) {
    console.error("❌ Error updating score:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Updated function to handle undefined category error in the backend
function updateRecommendations(recommendations, rounds) {
  const newRecommendations = { ...recommendations };

  rounds.forEach((round) => {
    const category = round.type; // "shape", "color", "number"
    const subcategory = round.name;

    // Map the category to the expected category name
    const validCategoryMapping = {
      shape: "Shapes",
      color: "Colors",
      number: "Numbers",
    };

    // Map the category to its proper format (Shapes, Colors, Numbers)
    const mappedCategory = validCategoryMapping[category];

    if (!mappedCategory) {
      console.error(`❌ Invalid category type: ${category}`);
      return; // Skip invalid categories
    }

    // Ensure the mapped category exists in the student data
    if (!student.subjects[mappedCategory]) {
      console.error(`❌ Category not found in student data: ${mappedCategory}`);
      return;
    }

    // Now safely update the student's category
    if (round.correct) {
      newRecommendations.Hard[mappedCategory].push(subcategory);
    } else {
      newRecommendations.Easy[mappedCategory].push(subcategory);
    }
  });

  return newRecommendations;
}

// ✅ Edit Student Information
router.put("/edit/:studentId", authenticateUser, async (req, res) => {
  try {
    const { studentId } = req.params;
    const { fullName, age, gender, profileImage } = req.body;

    if (!fullName || !age || !gender) {
      return res
        .status(400)
        .json({ message: "Full Name, Age, and Gender are required." });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      { fullName, age, gender, profileImage, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({
      message: "Student information updated successfully",
      student: updatedStudent,
    });
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
      return res.status(403).json({
        message:
          "Unauthorized: You do not have permission to delete this student.",
      });
    }

    // ✅ Remove student from class
    classWithStudent.students = classWithStudent.students.filter(
      (id) => id.toString() !== studentId
    );
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
    student.calculateRecommendations();

    // ✅ Save the student to ensure database is updated
    await student.save();

    console.log("✅ Updated Student Accuracy:", student.accuracy);

    res.json({ student });
  } catch (error) {
    console.error("❌ Error fetching student data:", error);
    res.status(500).json({ message: "Server error fetching student" });
  }
});

router.get(
  "/get-student-name/:studentId",
  authenticateUser,
  async (req, res) => {
    try {
      const { studentId } = req.params;
      const student = await Student.findById(studentId);
      if (!student) {
        return res.status(404).json({ message: "Student not found" });
      }
      res.json({ fullName: student.fullName });
    } catch (error) {
      console.error("❌ Error fetching student name:", error);
      res.status(500).json({ message: "Server error fetching student name" });
    }
  }
);

module.exports = router;
