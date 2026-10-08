const express = require("express");
const { registerUser, loginUser } = require("../controllers/authController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

// Protected route example
router.get("/me", verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User authenticated",
    user: req.user,
  });
});

module.exports = router;
