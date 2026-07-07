const express = require("express");
const {
  registerUser,
  loginUser,
  getCurrentUser
} = require("../controllers/authController");
const { protectUser } = require("../middlewares/userAuthMiddleware");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protectUser, getCurrentUser);

module.exports = router;