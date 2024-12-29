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
  const token = req.cookies.jwt;
  if (!token) {
    return;
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    res.status(200).json({
      message: "User is authenticated",
      user: {
        id: req.user.id,
        email: req.user.email,
      },
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please login again" });
    }
    res.status(401).json({ message: "Not authorized, token failed" });
  }
});

module.exports = router;
