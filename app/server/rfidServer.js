require("dotenv").config(); // ✅ Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const RFIDAnswer = require("./models/RFIDAnswer");
const RFIDResult = require("./models/RFIDResult");

const app = express();
const PORT = 5001;

// ✅ Middleware
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to husayDB"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

/**
 * ✅ Store Latest RFID Answer
 * - Saves `category`, `answer`, and `timestamp`
 */
app.post("/rfid-answer", async (req, res) => {
  try {
    const { category, answer } = req.body;
    if (!category || !answer) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // ✅ Store RFID answer with timestamp
    const newRFIDAnswer = new RFIDAnswer({
      category,
      answer,
      timestamp: new Date(),
    });
    await newRFIDAnswer.save();

    res.status(201).json({
      success: true,
      message: "New RFID Answer stored",
      data: newRFIDAnswer,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ Get Latest RFID Answer
 */
app.get("/latest-rfid-answer", async (req, res) => {
  try {
    const latestAnswer = await RFIDAnswer.findOne().sort({ timestamp: -1 });
    if (!latestAnswer) {
      return res
        .status(404)
        .json({ success: false, message: "No RFID answers found." });
    }
    res.status(200).json({ success: true, data: latestAnswer });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ Store RFID Result
 * - Saves `result` and `timestamp`
 */
app.post("/rfid-result", async (req, res) => {
  try {
    const { result } = req.body;

    if (!result) {
      return res.status(400).json({ message: "Missing result" });
    }

    // ✅ Store RFID result with timestamp
    const newRFIDResult = new RFIDResult({ result, timestamp: new Date() });
    await newRFIDResult.save();

    res.status(201).json({
      message: "✅ RFID Result saved",
      data: {
        result: newRFIDResult.result,
        timestamp: newRFIDResult.timestamp,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "❌ Error saving result", error });
  }
});

/**
 * ✅ Get Latest RFID Result
 */
app.get("/latest-rfid-result", async (req, res) => {
  try {
    const latestResult = await RFIDResult.findOne().sort({ timestamp: -1 });
    if (!latestResult) {
      return res
        .status(404)
        .json({ success: false, message: "No RFID results found." });
    }
    res.status(200).json({ success: true, data: latestResult });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * ✅ ESP32 Data Handling Route
 * - Stores incoming category and answer
 * - Returns latest result ("Correct" or "Incorrect")
 */
app.post("/data", async (req, res) => {
  try {
    console.log("🔄 Received Data:", req.body); // Debugging log

    const { category, answer } = req.body;
    if (!category || !answer) {
      return res.status(400).json({ message: "Missing category or answer" });
    }

    // ✅ Save new RFID answer
    const newRFIDAnswer = new RFIDAnswer({
      category,
      answer,
      timestamp: new Date(),
    });
    await newRFIDAnswer.save();

    // ✅ Fetch the latest RFID result
    let latestResult = await RFIDResult.findOne().sort({ timestamp: -1 });

    // ✅ If no result exists, create a default "pending" result
    if (!latestResult) {
      latestResult = await RFIDResult.create({
        result: "pending",
        timestamp: new Date(),
      });
    }

    res.status(200).json({
      message: "✅ RFID Answer saved successfully",
      result: latestResult.result, // Returns latest result
    });
  } catch (error) {
    console.log("❌ Error processing RFID data:", error);
    res.status(500).json({ message: "❌ Error saving data", error });
  }
});

/**
 * ✅ Start RFID Microservice
 */
app.listen(PORT, () => {
  console.log(`🚀 RFID Microservice running on port ${PORT}`);
});
