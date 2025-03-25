const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  employeeNo: { type: String, required: true, unique: true, index: true }, // ✅ Indexed for fast lookup

  students: [
    {
      type: mongoose.Schema.Types.ObjectId, // ✅ Store ObjectId references to Student
      ref: "Student", // ✅ Reference to the Student model
      index: true, // ✅ Index for optimized performance when querying students
    },
  ],

  subjects: [
    {
      name: {
        type: String,
        enum: ["Colors", "Shapes", "Numbers"],
        required: true,
        index: true,
      }, // ✅ Indexed for fast lookup
    },
  ],

  createdAt: { type: String, default: () => formatDate(new Date()) }, // 📅 Auto timestamp for creation
  updatedAt: { type: String, default: null }, // 📅 Updates whenever class data changes
});

// ✅ Function to format Date and Time in 12-hour format (same as Student.js)
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

// ✅ Update `updatedAt` whenever any change happens in the document
ClassSchema.pre("save", function (next) {
  if (this.isModified()) {
    // ✅ Update timestamp only if changes are detected
    this.updatedAt = formatDate(new Date());
  }
  next();
});

module.exports = mongoose.model("Class", ClassSchema);
