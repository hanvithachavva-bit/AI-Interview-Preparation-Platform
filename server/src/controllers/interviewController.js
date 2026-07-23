const Interview = require("../models/Interview");

const { generateQuestions } = require("../services/geminiService");
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
    const prompt = `
    Generate 10 ${difficulty} level ${type} interview questions
    for the role of ${role} at ${company}.

    Return only the questions as a numbered list.
    `;
    const questions = await generateQuestions(prompt);

    res.status(200).json({
      success: true,
      questions,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET MY INTERVIEWS =================

const getMyInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const interviews = await Interview.find({ userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= GET INTERVIEW BY ID =================

const getInterviewById = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user.id;

    const interview = await Interview.findOne({
      _id: interviewId,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      interview,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= UPDATE INTERVIEW =================

const updateInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user.id;

    const interview = await Interview.findOneAndUpdate(
      {
        _id: interviewId,
        userId,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview updated successfully",
      interview,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ================= DELETE INTERVIEW =================

const deleteInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user.id;

    const interview = await Interview.findOneAndDelete({
      _id: interviewId,
      userId,
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Interview deleted successfully",
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
  getMyInterviews,
  getInterviewById,
  updateInterview,
  deleteInterview,
};