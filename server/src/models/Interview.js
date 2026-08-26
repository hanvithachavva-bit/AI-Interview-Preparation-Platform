const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    // ============================================================
    // USER
    // ============================================================

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ============================================================
    // INTERVIEW DETAILS
    // ============================================================

    company: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "Technical",
        "HR",
        "Behavioral",
        "Coding",
        "Panel",
        "Group Discussion",
        "Mixed",
      ],
      default: "Technical",
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // ============================================================
    // ADAPTIVE INTERVIEW
    // ============================================================

    // Total number of questions requested by the user
    totalQuestions: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    // Difficulty that will be used for the next question
    currentDifficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    // ============================================================
    // INTERVIEW STATUS
    // ============================================================

    status: {
      type: String,
      enum: [
        "in-progress",
        "completed",
        "paused",
        "cancelled",
      ],
      default: "in-progress",
    },

    // ============================================================
    // TIME
    // ============================================================

    startedAt: {
      type: Date,
    },

    endedAt: {
      type: Date,
    },

    durationSeconds: {
      type: Number,
      default: 0,
    },

    // ============================================================
    // AI INFORMATION
    // ============================================================

    aiModel: {
      type: String,
    },

    promptVersion: {
      type: String,
    },

    // ============================================================
    // QUESTIONS
    // ============================================================

    questions: [
      {
        question: {
          type: String,
          required: true,
        },

        difficulty: {
          type: String,
          enum: ["Easy", "Medium", "Hard"],
          required: true,
        },
      },
    ],

    // ============================================================
    // QUESTION + ANSWER EVALUATIONS
    // ============================================================

    qa: [
      {
        question: {
          type: String,
        },

        answer: {
          type: String,
        },

        score: {
          type: Number,
        },

        feedback: {
          type: String,
        },

        strengths: {
          type: String,
        },

        improvements: {
          type: String,
        },
      },
    ],

    // ============================================================
    // OVERALL FEEDBACK
    // ============================================================

    feedback: {
      technicalScore: Number,

      communicationScore: Number,

      confidenceScore: Number,

      recommendation: String,

      // Overall AI assessment
      overallSummary: String,

      overallStrengths: String,

      overallImprovements: String,
    },

    // ============================================================
    // REPORT
    // ============================================================

    reportUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model(
  "Interview",
  interviewSchema
);

module.exports = Interview;