const mongoose = require("mongoose");

const ScoreSchema = new mongoose.Schema({
  points: { type: Number, default: 0 }, // Total points scored
  stars: { type: Number, default: 0 }, // Stars earned based on score
});

// ✅ Define structure for Easy difficulty (separate subjects)
const EasySubjectsSchema = new mongoose.Schema({
  colors: { type: ScoreSchema, default: () => ({}) },
  shapes: { type: ScoreSchema, default: () => ({}) },
  numbers: { type: ScoreSchema, default: () => ({}) },
});

// ✅ Define structure for Medium & Hard (combined subjects)
const MixedSubjectsSchema = new mongoose.Schema({
  medium: { type: ScoreSchema, default: () => ({}) },
  hard: { type: ScoreSchema, default: () => ({}) },
});

// ✅ Final Student Schema
const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profileImage: { type: String, default: "" },
  employeeNo: { type: String, required: true },

  // ✅ Scores for practice and challenge modes
  modes: {
    practice: {
      easy: { type: EasySubjectsSchema, default: () => ({}) }, // ✅ Separate subjects for Easy
      mixed: { type: MixedSubjectsSchema, default: () => ({}) }, // ✅ Combined scores for Medium & Hard
    },
    challenge: {
      easy: { type: EasySubjectsSchema, default: () => ({}) }, // ✅ Separate subjects for Easy
      mixed: { type: MixedSubjectsSchema, default: () => ({}) }, // ✅ Combined scores for Medium & Hard
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
