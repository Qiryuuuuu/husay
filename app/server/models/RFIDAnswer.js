const mongoose = require("mongoose");

// ✅ RFID Answer Schema (with automatic timestamps)
const RFIDAnswerSchema = new mongoose.Schema(
  {
    category: { type: String, enum: ["Shapes", "Colors", "Numbers"], required: true },
    answer: { type: String, required: true }, // ✅ Only stores the answer, no item comparison
    timestamp: { type: Date, default: Date.now }
  }
);

// ✅ Model
const RFIDAnswer = mongoose.model("RFIDAnswer", RFIDAnswerSchema);
module.exports = RFIDAnswer;
