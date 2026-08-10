const express = require("express");

const {
  analyzeResumeMatch,
} = require("../controllers/resumeController");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.post(
  "/analyze",
  authMiddleware,
  upload.single("resume"),
  analyzeResumeMatch
);

module.exports = router;