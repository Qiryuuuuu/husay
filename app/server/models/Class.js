const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // 🔹 Links to the teacher/user who added the students
  students: [
    {
      fullName: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
      gradeLevel: { type: String, required: true },
      parentEmail: { type: String, required: true },
      stars: { type: Number, default: 0 }, // ⭐ Tracks student progress
      profileImage: { type: String, default: "" }, // 🖼️ Stores profile picture URL
      createdAt: { type: Date, default: Date.now }, // 📅 Auto timestamp
    },
  ],
});

module.exports = mongoose.model("Class", ClassSchema);
