require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ Middleware
app.use(cors());
app.use(bodyParser.json()); // ✅ Keep body-parser for JSON handling
app.use(bodyParser.urlencoded({ extended: true })); // ✅ Supports form submissions

// ✅ MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to husayDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Import Routes
const authRoutes = require("./routes/authRoutes");
const classRoutes = require("./routes/classRoutes"); // ✅ New route for storing student data

// ✅ Use Routes
app.use("/api/auth", authRoutes);
app.use("/api/class", classRoutes); // ✅ Add new class routes

// ✅ Server Listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
