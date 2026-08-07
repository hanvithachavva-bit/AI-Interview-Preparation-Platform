const express = require("express");

const router = express.Router();

const {
  createInterview,
  getMyInterviews,
  getInterviewById,
  deleteInterview,
  updateInterview,
  submitAnswer,
  submitInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createInterview);

router.get("/", authMiddleware, getMyInterviews);

router.get("/:id", authMiddleware, getInterviewById);

router.put("/:id", authMiddleware, updateInterview);
router.post("/:id/answer", authMiddleware, submitAnswer);
router.post("/:id/submit", authMiddleware, submitInterview);
router.delete("/:id", authMiddleware, deleteInterview);

module.exports = router;