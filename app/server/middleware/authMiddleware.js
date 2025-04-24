const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const authenticateUser = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    console.log("🔹 Token Received:", token);

    if (!token || !token.startsWith("Bearer ")) {
      console.log("❌ Unauthorized: Token is missing or invalid.");
      return res
        .status(401)
        .json({ message: "Unauthorized: Token is missing or invalid." });
    }

    token = token.split(" ")[1]; // ✅ Extract actual token
    console.log("🔹 Extracted Token:", token);

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔹 Decoded Token Data:", decoded);

      const user = await User.findById(decoded.id).select("-password");
      if (!user) {
        console.log("❌ User not found for token.");
        return res.status(404).json({ message: "User not found." });
      }

      console.log("🔹 Authenticated User:", {
        id: user._id,
        employeeNo: user.employeeNo,
      });

      req.user = { id: user._id, employeeNo: user.employeeNo };
      next();
    } catch (verifyError) {
      console.log("❌ JWT Verification Error:", verifyError);
      if (verifyError.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expired. Please log in again." });
      }
      return res.status(403).json({ message: "Invalid token." });
    }
  } catch (error) {
    console.log("❌ General Token Verification Failed:", error);
    return res.status(403).json({ message: "Invalid token." });
  }
};

module.exports = authenticateUser;
