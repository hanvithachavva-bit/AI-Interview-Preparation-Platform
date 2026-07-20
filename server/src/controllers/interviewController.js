const Interview = require("../models/Interview");

// ================= CREATE INTERVIEW =================

const createInterview = async (req, res) => {
  try {
    const { company, role, type, difficulty } = req.body;

    const userId = req.user.id;

    const interview = await Interview.create({
      userId,
      company,
      role,
      type,
      difficulty,
    });

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createInterview,
};