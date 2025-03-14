const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: {type: String, required: true, unique: true},
  phoneNumber: { type: String, required: false, unique: true },
  fullName: { type: String, required: true },
  employeeNo: { type: String, required: true, unique: true }, // ✅ Ensure employeeNo is unique
  password: { type: String, required: true },
  securityQuestions: [
    {
      question: String,
      answer: String,
    },
  ],
});

module.exports = mongoose.model("User", UserSchema);
