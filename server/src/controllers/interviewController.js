const Interview = require("../models/Interview");

const {
  generateQuestions,
  evaluateAnswer,
  generateOverallAssessment,
} = require("../services/geminiService");

// ================= CREATE INTERVIEW =================

const createInterview = async (req, res) => {
  try {
    const {
      company,
      role,
      type,
      difficulty,
      numberOfQuestions,
    } = req.body;

    const userId = req.user.id;

    // ================= CREATE AI PROMPT =================

    let typeInstruction = "";

    switch (type) {
      case "Technical":
        typeInstruction = `
Focus on technical questions related to the role.
Test the candidate's technical knowledge, concepts,
tools, technologies, and practical understanding.
`;
        break;

      case "HR":
        typeInstruction = `
Focus on HR interview questions.
Ask about motivation, career goals, strengths,
weaknesses, company fit, communication, and professional goals.
Do not generate technical questions.
`;
        break;

      case "Behavioral":
        typeInstruction = `
Focus on behavioral interview questions.
Ask about the candidate's past experiences,
teamwork, leadership, conflict resolution,
problem solving, challenges, failures, and achievements.
Prefer questions that allow the candidate to explain real situations.
Do not generate purely technical questions.
`;
        break;

      case "Coding":
        typeInstruction = `
Focus on coding and problem-solving interview questions.
Ask programming problems, algorithms, data structures,
logic-building questions, debugging scenarios, and
coding-related problem solving.
Questions should be appropriate for the given role and difficulty.
`;
        break;

      case "Panel":
        typeInstruction = `
Generate questions suitable for a panel interview.
Include a realistic mixture of technical, behavioral,
situational, and role-related questions.
Questions should be suitable for multiple interviewers.
`;
        break;

      case "Group Discussion":
        typeInstruction = `
Generate group discussion topics and questions.
Focus on topics that allow the candidate to demonstrate
communication, reasoning, teamwork, leadership,
critical thinking, and the ability to express opinions.
Do not generate normal technical interview questions.
`;
        break;

      case "Mixed":
        typeInstruction = `
Generate a balanced mixture of technical, HR,
behavioral, and role-specific questions.
The questions should cover different aspects of the candidate's
interview preparation rather than focusing only on technical knowledge.
`;
        break;

      default:
        typeInstruction = `
Generate questions appropriate for the specified interview type.
`;
    }

    const prompt = `
You are an expert interviewer conducting a ${type || "Technical"} interview.

Job Role:
${role}

Company:
${company || "Not specified"}

Difficulty:
${difficulty}

Number of Questions:
${numberOfQuestions}

Interview Type:
${type || "Technical"}

${typeInstruction}

Generate exactly ${numberOfQuestions} interview questions.

Important rules:

- Questions must match the selected interview type.
- Questions must match the job role.
- Questions must match the requested difficulty.
- Do not generate questions from another interview type unless the selected type is "Mixed" or "Panel".
- Avoid duplicate questions.
- Keep questions clear and suitable for an interview.
- Return only the questions as a numbered list.
- Do not include answers.
- Do not include explanations.
- Do not include headings.

Example format:

1. First question
2. Second question
3. Third question
`;

    // ================= GENERATE QUESTIONS =================

    const questions = await generateQuestions(prompt);

    // ================= CONVERT RESPONSE TO ARRAY =================

    const questionArray = questions
      .split("\n")
      .map((question) =>
        question
          .replace(/^\s*\d+[\.\)]\s*/, "")
          .trim()
      )
      .filter((question) => question !== "");
    // ================= CREATE INTERVIEW DOCUMENT =================

    const interview = new Interview({
      userId,
      company,
      role,
      type,
      difficulty,
      questions: questionArray,
      startedAt: new Date(),
    });

    // ================= SAVE TO MONGODB =================

    await interview.save();

    res.status(201).json({
      success: true,
      message: "Interview created successfully",
      interview,
    });
  } catch (error) {
    console.error("Create interview error:", error);

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
// ================= GET PERFORMANCE =================

const getPerformance = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all interviews belonging to the logged-in user
    const interviews = await Interview.find({ userId }).sort({
      createdAt: -1,
    });

    // ================= BASIC COUNTS =================

    const totalInterviews = interviews.length;

    const completedInterviews = interviews.filter(
      (interview) => interview.status === "completed"
    );

    const completedCount = completedInterviews.length;

    const inProgressCount = interviews.filter(
      (interview) => interview.status === "in-progress"
    ).length;

    // ================= CALCULATE SCORES =================

    const interviewScores = completedInterviews
      .map((interview) => {
        if (!interview.qa || interview.qa.length === 0) {
          return null;
        }

        const totalScore = interview.qa.reduce(
          (sum, item) => sum + (item.score || 0),
          0
        );

        const averageScore =
          interview.qa.length > 0
            ? totalScore / interview.qa.length
            : 0;

        return {
          interview,
          averageScore,
        };
      })
      .filter(Boolean);

    // ================= OVERALL AVERAGE =================

    const averageScore =
      interviewScores.length > 0
        ? interviewScores.reduce(
            (sum, item) => sum + item.averageScore,
            0
          ) / interviewScores.length
        : 0;

    // ================= BEST SCORE =================

    const bestScore =
      interviewScores.length > 0
        ? Math.max(
            ...interviewScores.map(
              (item) => item.averageScore
            )
          )
        : 0;

    // ================= AVERAGE DURATION =================

    const interviewsWithDuration =
      completedInterviews.filter(
        (interview) =>
          interview.durationSeconds &&
          interview.durationSeconds > 0
      );

    const averageDurationSeconds =
      interviewsWithDuration.length > 0
        ? interviewsWithDuration.reduce(
            (sum, interview) =>
              sum + interview.durationSeconds,
            0
          ) / interviewsWithDuration.length
        : 0;

    // ================= PERFORMANCE BY TYPE =================

    const typeMap = {};

    interviewScores.forEach(
      ({ interview, averageScore }) => {
        const type = interview.type || "Unknown";

        if (!typeMap[type]) {
          typeMap[type] = {
            type,
            interviews: 0,
            totalScore: 0,
          };
        }

        typeMap[type].interviews += 1;
        typeMap[type].totalScore += averageScore;
      }
    );

    const performanceByType = Object.values(
      typeMap
    ).map((item) => ({
      type: item.type,
      interviews: item.interviews,
      averageScore: Number(
        (item.totalScore / item.interviews).toFixed(1)
      ),
    }));

    // ================= PERFORMANCE BY DIFFICULTY =================

    const difficultyMap = {};

    interviewScores.forEach(
      ({ interview, averageScore }) => {
        const difficulty =
          interview.difficulty || "Unknown";

        if (!difficultyMap[difficulty]) {
          difficultyMap[difficulty] = {
            difficulty,
            interviews: 0,
            totalScore: 0,
          };
        }

        difficultyMap[difficulty].interviews += 1;
        difficultyMap[difficulty].totalScore +=
          averageScore;
      }
    );

    const performanceByDifficulty =
      Object.values(difficultyMap).map((item) => ({
        difficulty: item.difficulty,
        interviews: item.interviews,
        averageScore: Number(
          (item.totalScore / item.interviews).toFixed(1)
        ),
      }));

    // ================= RECENT PERFORMANCE =================

    const recentPerformance = interviewScores
      .slice(0, 5)
      .map(({ interview, averageScore }) => ({
        id: interview._id,
        company: interview.company,
        role: interview.role,
        type: interview.type,
        difficulty: interview.difficulty,
        score: Number(averageScore.toFixed(1)),
        durationSeconds: interview.durationSeconds || 0,
        completedAt:
          interview.endedAt || interview.updatedAt,
      }));

    // ================= RESPONSE =================

    res.status(200).json({
      success: true,

      overview: {
        totalInterviews,
        completedInterviews: completedCount,
        inProgressInterviews: inProgressCount,
        averageScore: Number(
          averageScore.toFixed(1)
        ),
        bestScore: Number(bestScore.toFixed(1)),
        averageDurationSeconds: Math.round(
          averageDurationSeconds
        ),
      },

      performanceByType,

      performanceByDifficulty,

      recentPerformance,
    });
  } catch (error) {
    console.error(
      "Get performance error:",
      error
    );

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

// ================= SUBMIT ANSWER =================

const submitAnswer = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const { question, answer } = req.body;
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

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }
    const evaluation = await evaluateAnswer(
      question,
      answer
    );
    interview.qa.push({
      question,
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
    });

    // Mark interview as completed if all questions are answered
    if (
      interview.qa.length ===
      interview.questions.length
    ) {
      interview.status = "completed";
    }

    const savedInterview = await interview.save();

    const updatedInterview =
      await Interview.findById(interviewId);

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

// ================= SUBMIT COMPLETE INTERVIEW =================

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

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Interview already completed",
      });
    }

    // ================= EVALUATE ALL ANSWERS =================

    const evaluations = await Promise.all(
      answers.map(async (item) => {
        const evaluation = await evaluateAnswer(
          item.question,
          item.answer
        );
        return {
          question: item.question,
          answer: item.answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          improvements: evaluation.improvements,
        };
      })
    );

    // ================= SAVE QUESTION EVALUATIONS =================

    interview.qa = evaluations;

    // ================= GENERATE OVERALL ASSESSMENT =================
    const overallAssessment =
      await generateOverallAssessment(
        evaluations
      );

    // ================= SAVE OVERALL ASSESSMENT =================

    interview.feedback = {
      overallSummary:
        overallAssessment.overallSummary,

      overallStrengths:
        overallAssessment.overallStrengths,

      overallImprovements:
        overallAssessment.overallImprovements,

      recommendation:
        overallAssessment.recommendation,
    };

    // ================= RECORD END TIME =================

    const endedAt = new Date();

    const durationSeconds = Math.floor(
      (endedAt - interview.startedAt) / 1000
    );

    interview.endedAt = endedAt;
    interview.durationSeconds = durationSeconds;
    interview.status = "completed";

    // ================= SAVE INTERVIEW =================

    await interview.save();

    res.status(200).json({
      success: true,
      message: "Interview submitted successfully",
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

// ================= EXPORT =================

module.exports = {
  createInterview,
  getMyInterviews,
  getPerformance,
  getInterviewById,
  updateInterview,
  deleteInterview,
  submitAnswer,
  submitInterview,
};