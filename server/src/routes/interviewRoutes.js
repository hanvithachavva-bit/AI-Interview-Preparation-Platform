const express = require("express");

const router = express.Router();

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
  updateInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createInterview);

router.get("/", authMiddleware, getMyInterviews);

router.get("/:id", authMiddleware, getInterviewById);

router.put("/:id", authMiddleware, updateInterview);

router.delete("/:id", authMiddleware, deleteInterview);

module.exports = router;