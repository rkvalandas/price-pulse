const express = require("express");
const {
  signUpUser,
  loginUser,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/user");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify", async (req, res) => {
  try {
    // Check for JWT token in Authorization header
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      // Get token from header (format: "Bearer token")
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(200).json({
        isAuthenticated: false,
        message: "User not authenticated, no token provided",
      });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user associated with the token
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(200).json({
        isAuthenticated: false,
        message: "User not found",
      });
    }

    // Return success response with user data
    res.status(200).json({
      isAuthenticated: true,
      message: "User is authenticated",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(200).json({
        isAuthenticated: false,
        message: "Token expired, please log in again",
      });
    }

    res.status(200).json({
      isAuthenticated: false,
      message: "Authentication failed due to an error",
    });
  }
});

module.exports = router;
