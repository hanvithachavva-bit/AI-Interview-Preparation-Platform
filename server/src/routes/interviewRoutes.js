const express = require("express");

const router = express.Router();

const {
  createInterview,
  getMyInterviews,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createInterview);

router.get("/", authMiddleware, getMyInterviews);

module.exports = router;