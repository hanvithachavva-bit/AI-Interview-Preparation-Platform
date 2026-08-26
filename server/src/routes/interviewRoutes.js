const express = require("express");

const router = express.Router();

const {
  createInterview,
  getMyInterviews,
  getPerformance,
  getInterviewById,
  deleteInterview,
  updateInterview,
  submitAnswer,
  submitInterview,
} = require("../controllers/interviewController");

const authMiddleware = require("../middleware/authMiddleware");

// ============================================================
// INTERVIEW ROUTES
// ============================================================

// Create a new interview
router.post(
  "/",
  authMiddleware,
  createInterview
);

// Get all interviews of logged-in user
router.get(
  "/",
  authMiddleware,
  getMyInterviews
);

// Get performance analytics
router.get(
  "/performance",
  authMiddleware,
  getPerformance
);

// Get a specific interview
router.get(
  "/:id",
  authMiddleware,
  getInterviewById
);

// Update an interview
router.put(
  "/:id",
  authMiddleware,
  updateInterview
);

// Submit one answer and generate next adaptive question
router.post(
  "/:id/answer",
  authMiddleware,
  submitAnswer
);

// Complete an interview using the legacy submit flow
router.post(
  "/:id/submit",
  authMiddleware,
  submitInterview
);

// Delete an interview
router.delete(
  "/:id",
  authMiddleware,
  deleteInterview
);

module.exports = router;