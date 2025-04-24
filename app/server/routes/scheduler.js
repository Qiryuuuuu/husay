const cron = require("node-cron");
const Student = require("../models/Student");

// ⏰ Schedule to run every day at midnight (00:00)
cron.schedule("0 0 * * *", async () => {
  console.log("🕛 Running daily reset of game time...");

  try {
    const result = await Student.updateMany(
      {},
      {
        $set: {
          "gameTime.timeSpent": 0,
          "gameTime.timeLeft": 60,
          "gameTime.sessionStart": null,
          "gameTime.sessionEnd": null,
        },
      }
    );

    console.log(
      `✅ Daily reset complete. Updated ${
        result.modifiedCount || result.nModified
      } students.`
    );
  } catch (err) {
    console.log("❌ Error resetting game times:", err);
  }
});
