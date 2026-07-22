const express = require("express");

const router = express.Router();

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createInterview);

router.get("/", authMiddleware, getMyInterviews);

router.get("/:id", authMiddleware, getInterviewById);

router.delete("/:id", authMiddleware, deleteInterview);

module.exports = router;