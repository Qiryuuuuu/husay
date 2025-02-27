const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  stars: { type: Number, default: 0 }, // ⭐ Tracks student progress
  profileImage: { type: String, default: "" }, // 🖼️ Stores profile picture URL
  employeeNo: { type: String, required: true }, // ✅ Link to employeeNo
  createdAt: { type: Date, default: Date.now }, // 📅 Auto timestamp
});

module.exports = mongoose.model("Student", StudentSchema);
