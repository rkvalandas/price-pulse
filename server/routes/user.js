const express = require("express");
const { signUpUser, loginUser, logoutUser, verifyEmail, forgotPassword, resetPassword } = require("../controllers/user");
const {protect} = require("../middleware/auth")
const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/verify", protect, (req, res) => {
    if (req.user) {
        res.status(200).json({
            message: "User is authenticated",
            user: {
                id: req.user.id,         // Include safe user details
                email: req.user.email,   // Example: Include email if needed
            },
        });
    } else {
        res.status(401).json({ message: "User is not authenticated" });
    }
});

module.exports = router;
