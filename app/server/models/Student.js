const mongoose = require("mongoose");

// ✅ Score Schema for tracking individual subject performance
const ScoreSchema = new mongoose.Schema({
  correct: { type: Number, default: 0 },
  incorrect: { type: Number, default: 0 },
  percentage: { type: Number, default: 0, index: true }, // Indexed for faster queries
});

// ✅ Subject Categories Schema
const CategorySchema = new mongoose.Schema({
  Shapes: {
    Rectangle: { type: ScoreSchema, default: () => ({}) },
    Triangle: { type: ScoreSchema, default: () => ({}) },
    Circle: { type: ScoreSchema, default: () => ({}) },
    Square: { type: ScoreSchema, default: () => ({}) },
  },
  Colors: {
    Red: { type: ScoreSchema, default: () => ({}) },
    Yellow: { type: ScoreSchema, default: () => ({}) },
    Green: { type: ScoreSchema, default: () => ({}) },
    Blue: { type: ScoreSchema, default: () => ({}) },
    Black: { type: ScoreSchema, default: () => ({}) },
    Gray: { type: ScoreSchema, default: () => ({}) },
    White: { type: ScoreSchema, default: () => ({}) },
  },
  Numbers: {
    One: { type: ScoreSchema, default: () => ({}) },
    Two: { type: ScoreSchema, default: () => ({}) },
    Three: { type: ScoreSchema, default: () => ({}) },
    Four: { type: ScoreSchema, default: () => ({}) },
    Five: { type: ScoreSchema, default: () => ({}) },
    Six: { type: ScoreSchema, default: () => ({}) },
    Seven: { type: ScoreSchema, default: () => ({}) },
    Eight: { type: ScoreSchema, default: () => ({}) },
    Nine: { type: ScoreSchema, default: () => ({}) },
    Ten: { type: ScoreSchema, default: () => ({}) },
  },
});

// ✅ Stars Schema
const StarsSchema = new mongoose.Schema({
  totalStars: { type: Number, default: 0 },
});

// ✅ Attendance Schema
const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true }, // Formatted as "Date: YYYY-MM-DD | Time: HH:MM:SS AM/PM"
  status: { type: String, enum: ["Present", "Absent"], required: true },
});

// ✅ Recommendations Schema
const RecommendationSchema = new mongoose.Schema({
  Easy: {
    Shapes: { type: [String], default: [] },
    Numbers: { type: [String], default: [] },
    Colors: { type: [String], default: [] },
  },
  Medium: {
    Mixed: { type: [String], default: [] },
  },
  Hard: {
    Shapes: { type: [String], default: [] },
    Numbers: { type: [String], default: [] },
    Colors: { type: [String], default: [] },
  },
});

// ✅ Main Student Schema
const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  profileImage: { type: String, default: "" },
  employeeNo: { type: String, required: true, index: true },

  subjects: { type: CategorySchema, default: () => ({}) },
  stars: { type: StarsSchema, default: () => ({}) },
  recommendations: { type: RecommendationSchema, default: () => ({}) },

  accuracy: {
    correct: { type: Number, default: 0 },
    incorrect: { type: Number, default: 0 },
  },

  attendance: { type: [AttendanceSchema], default: [] },

  gameTime: {
    timeSpent: { type: Number, default: 0, min: 0, max: 60 },
    timeLeft: { type: Number, default: 60, min: 0, max: 60 },
    sessionStart: { type: String, default: null },
    sessionEnd: { type: String, default: null },
  },

  createdAt: { type: String, default: () => formatDate(new Date()) },
  updatedAt: { type: String, default: null },
});

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

  // Convert to the required format
  const formattedDate = date.toLocaleDateString("en-US", options).replace(/\//g, "-");
  const formattedTime = date.toLocaleTimeString("en-US", options);

  return `Date: ${formattedDate} | Time: ${formattedTime}`;
}

// ✅ Update Game Time Before Saving
StudentSchema.methods.updateGameTime = function () {
  const now = new Date();
  const formattedNow = formatDate(now);

  if (this.gameTime.sessionStart) {
    const sessionMinutes = Math.floor(
      (now - new Date(this.gameTime.sessionStart.split("|")[0])) / 60000
    );

    this.gameTime.timeSpent = Math.min(60, this.gameTime.timeSpent + sessionMinutes);
    this.gameTime.timeLeft = Math.max(0, 60 - this.gameTime.timeSpent);
    this.gameTime.sessionEnd = formattedNow; // ✅ Always update sessionEnd with last session time

    if (this.gameTime.timeLeft === 0) {
      this.gameTime.sessionStart = formattedNow; // ✅ KEEP the last sessionStart instead of setting null
    } else {
      this.gameTime.sessionStart = formattedNow; // ✅ Update sessionStart for the latest session
    }
  }
};


// ✅ Mark Attendance as Absent if No Gameplay
StudentSchema.methods.markAbsentIfNoPlay = function () {
  const now = new Date();
  const formattedToday = formatDate(now);
  const todayDateOnly = formattedToday.split(" | ")[0];

  const existingAttendance = this.attendance.find(a => a.date.startsWith(todayDateOnly));

  // ✅ If sessionStart exists and no attendance recorded, mark "Present" at sessionStart time
  if (this.gameTime.sessionStart && !existingAttendance) {
    this.attendance.push({ date: this.gameTime.sessionStart, status: "Present" });
  } 
  // ✅ If no sessionStart and no attendance, mark "Absent"
  else if (!this.gameTime.sessionStart && !existingAttendance) {
    this.attendance.push({ date: formattedToday, status: "Absent" });
    this.gameTime.sessionEnd = null;  // Ensure sessionEnd is null when absent
  }
};




// ✅ Calculate Stats (Accuracy & Percentage)
StudentSchema.methods.calculateStats = function () {
  let totalCorrect = 0, totalIncorrect = 0;
  ["Shapes", "Colors", "Numbers"].forEach(category => {
    Object.values(this.subjects[category]).forEach(entry => {
      entry.correct = Number(entry.correct) || 0;
      entry.incorrect = Number(entry.incorrect) || 0;
      entry.percentage = entry.correct + entry.incorrect > 0
        ? parseFloat(((entry.correct / (entry.correct + entry.incorrect)) * 100).toFixed(2))
        : 0;
      totalCorrect += entry.correct;
      totalIncorrect += entry.incorrect;
    });
  });
  this.accuracy.correct = totalCorrect;
  this.accuracy.incorrect = totalIncorrect;
};

// ✅ Calculate Recommendations
StudentSchema.methods.calculateRecommendations = function () {
  const getLowest = (data, n) =>
    Object.entries(data).sort(([,a],[,b]) => a.percentage - b.percentage).slice(0,n).map(([k])=>k);

  this.recommendations = {
    Easy: {
      Shapes: ["Square","Triangle","Rectangle","Circle",...getLowest(this.subjects.Shapes,1)],
      Numbers: getLowest(this.subjects.Numbers,5),
      Colors: getLowest(this.subjects.Colors,5),
    },
    Medium: {
      Mixed: getLowest({...this.subjects.Shapes, ...this.subjects.Colors, ...this.subjects.Numbers}, 5),
    },
    Hard: {
      Shapes: ["Square","Triangle","Rectangle","Circle",...getLowest(this.subjects.Shapes,1)],
      Numbers: getLowest(this.subjects.Numbers,1),
      Colors: getLowest(this.subjects.Colors,5),
    },
  };
};

// ✅ Pre-save Hook to Auto-Update Fields Before Saving
StudentSchema.pre("save", function (next) {
  this.calculateStats();
  this.calculateRecommendations();
  this.markAbsentIfNoPlay();
  this.updateGameTime();
  this.updatedAt = formatDate(new Date());
  next();
});

module.exports = mongoose.model("Student", StudentSchema);
