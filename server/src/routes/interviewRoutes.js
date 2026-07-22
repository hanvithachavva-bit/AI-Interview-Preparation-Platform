const express = require("express");

const router = express.Router();

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

// Create Interview
router.post("/", authMiddleware, createInterview);

// Get All Interviews of Logged-in User
router.get("/", authMiddleware, getMyInterviews);

// Get Single Interview by ID
router.get("/:id", authMiddleware, getInterviewById);

module.exports = router;