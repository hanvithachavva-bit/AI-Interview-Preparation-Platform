const Interview = require("../models/Interview");
const {
  generateQuestions,
  evaluateAnswer,
} = require("../services/geminiService");
const createInterview = async (req, res) => {
  try {
    const { role, difficulty, numberOfQuestions } = req.body;

    const userId = req.user.id;

    // Create AI prompt
    const prompt = `
    Generate ${numberOfQuestions} ${difficulty} level interview questions
    for the role of ${role}.

    Return only the questions as a numbered list.
    `;

    // Generate questions using Gemini
    const questions = await generateQuestions(prompt);

    // Convert response into an array
    const questionArray = questions
      .split("\n")
      .map((question) => question.replace(/^\d+\.\s*/, "").trim())
      .filter((question) => question !== "");

    console.log(questionArray);

    // Create interview document
    const interview = new Interview({
      userId,
      role,
      difficulty,
      questions: questionArray,
    });

    // Save to MongoDB
    await interview.save();

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
const submitAnswer = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const { question, answer } = req.body;
    const userId = req.user.id;

    console.log("Interview ID:", interviewId);
    console.log("Question:", question);
    console.log("Answer:", answer);

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
    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }

    console.log("Interview Found");

    const evaluation = {
      score: 8,
      feedback: "Good answer. This is a mock evaluation.",
    };

    console.log("Evaluation:", evaluation);

    interview.qa.push({
      question,
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
    });

// Mark interview as completed if all questions are answered
    console.log("QA Length:", interview.qa.length);
    console.log("Questions Length:", interview.questions.length);
    if (interview.qa.length === interview.questions.length) {
      console.log("Interview Completed!");
      interview.status = "completed";
    }
    console.log("QA after push:", interview.qa);

    const savedInterview = await interview.save();
    console.log("Saved Interview:");
    console.log(savedInterview);

    const updatedInterview = await Interview.findById(interviewId);

    console.log("Updated Interview:");
    console.log(updatedInterview);
    console.log("Updated QA:");
    console.log(updatedInterview.qa);
    console.log("Interview saved successfully");

    res.status(200).json({
      success: true,
      message: "Answer submitted successfully",
      interview,
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const submitInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const { answers } = req.body;
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

    console.log("Received Answers:");
    console.log(answers);

    res.status(200).json({
      success: true,
      message: "Interview received successfully",
    });

  } catch (error) {
    console.error(error);

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
  submitAnswer,
  submitInterview,
};