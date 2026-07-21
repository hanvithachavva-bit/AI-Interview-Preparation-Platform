const mongoose = require("mongoose");
const interviewSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

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
      required: true,
    },

    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },

    status: {
      type: String,
      enum: ["in-progress", "completed", "paused", "cancelled"],
      default: "in-progress",
    },

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

    aiModel: {
      type: String,
    },

    promptVersion: {
      type: String,
    },

    qa: [
      {
        question: String,
        answer: String,
        score: Number,
        feedback: String,
      },
    ],

    feedback: {
      technicalScore: Number,
      communicationScore: Number,
      confidenceScore: Number,
      recommendation: String,
    },

    reportUrl: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Interview = mongoose.model("Interview", interviewSchema);

module.exports = Interview;