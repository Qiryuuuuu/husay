const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  employeeNo: { type: String, required: true, unique: true },  // ✅ Match with `employeeNo` in User
  students: [
    {
      type: mongoose.Schema.Types.ObjectId, // ✅ Store ObjectId references to Student
      ref: "Student", // ✅ Reference to the Student model
    },
  ],
  subjects: [
    {
      name: { type: String, enum: ["Colors", "Shapes", "Numbers"], required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now }, // 📅 Auto timestamp
});

module.exports = mongoose.model("Class", ClassSchema);
