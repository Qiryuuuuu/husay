const mongoose = require("mongoose");

// ✅ RFID Result Schema 
const RFIDResultSchema = new mongoose.Schema({
  result: { type: String, enum: ["Correct", "Incorrect"], required: true },
  timestamp: { type: Date, default: Date.now }
});

// ✅ Model
const RFIDResult = mongoose.model("RFIDResult", RFIDResultSchema);
module.exports = RFIDResult;