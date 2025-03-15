const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  points: { type: Number, default: 0 }, // Total points scored
  stars: { type: Number, default: 0 }, // Stars earned based on score
});

const DifficultySchema = new mongoose.Schema({
  Easy: { type: ScoreSchema, default: () => ({}) },
  Medium: { type: ScoreSchema, default: () => ({}) },
  Hard: { type: ScoreSchema, default: () => ({}) },
});

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profileImage: { type: String, default: "" },
  employeeNo: { type: String, required: true },

  // ✅ Subject-based scores for both practice and challenge modes
  subjects: {
    Colors: {
      practice: { type: DifficultySchema, default: () => ({}) },
      challenge: { type: DifficultySchema, default: () => ({}) },
    },
    Shapes: {
      practice: { type: DifficultySchema, default: () => ({}) },
      challenge: { type: DifficultySchema, default: () => ({}) },
    },
    Numbers: {
      practice: { type: DifficultySchema, default: () => ({}) },
      challenge: { type: DifficultySchema, default: () => ({}) },
    },
  },

  // ✅ New Attendance Tracking
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ["Present", "Absent"], required: true },
    },
  ],

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Student", StudentSchema);
