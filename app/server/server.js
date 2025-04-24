require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Middleware
app.use(
  cors({
    origin: "*",
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to husayDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes");
const studentRoutes = require("./routes/studentRoutes");

// ✅ Ensure each route is properly attached as middleware
app.use("/api/auth", authRoutes);
app.use("/api/class", classRoutes);
app.use("/api/students", studentRoutes);

require("./routes/scheduler");

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// ✅ Handle undefined routes to prevent HTML errors
app.use((req, res) => {
  res.status(404).json({ message: "API route not found" });
});
