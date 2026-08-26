const Interview = require("../models/Interview");

const {
  generateSingleQuestion,
  evaluateAnswer,
  generateOverallAssessment,
} = require("../services/geminiService");

// ============================================================
// CREATE INTERVIEW
// ============================================================

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

    // ================= VALIDATION =================

    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: "Job role is required",
      });
    }

    const totalQuestions = Number(numberOfQuestions);

    if (
      !Number.isInteger(totalQuestions) ||
      totalQuestions < 1 ||
      totalQuestions > 20
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Number of questions must be between 1 and 20",
      });
    }

    // ================= CREATE TYPE INSTRUCTION =================

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
weaknesses, company fit, communication,
and professional goals.
Do not generate technical questions.
`;
        break;

      case "Behavioral":
        typeInstruction = `
Focus on behavioral interview questions.
Ask about the candidate's past experiences,
teamwork, leadership, conflict resolution,
problem solving, challenges, failures, and achievements.
Prefer questions that allow the candidate to explain
real situations.
Do not generate purely technical questions.
`;
        break;

      case "Coding":
        typeInstruction = `
Focus on coding and problem-solving interview questions.
Ask programming problems, algorithms, data structures,
logic-building questions, debugging scenarios,
and coding-related problem solving.
`;
        break;

      case "Panel":
        typeInstruction = `
Generate questions suitable for a panel interview.
Include a realistic mixture of technical, behavioral,
situational, and role-related questions.
`;
        break;

      case "Group Discussion":
        typeInstruction = `
Generate group discussion topics and questions.
Focus on communication, reasoning, teamwork,
leadership, critical thinking, and expressing opinions.
Do not generate normal technical interview questions.
`;
        break;

      case "Mixed":
        typeInstruction = `
Generate a balanced mixture of technical, HR,
behavioral, and role-specific questions.
`;
        break;

      default:
        typeInstruction = `
Generate questions appropriate for the specified
interview type.
`;
    }

    // ================= GENERATE FIRST QUESTION =================

    const prompt = `
You are an expert interviewer conducting a ${
      type || "Technical"
    } interview.

Job Role:
${role}

Company:
${company || "Not specified"}

Difficulty:
${difficulty}

Interview Type:
${type || "Technical"}

${typeInstruction}

Generate exactly ONE interview question.

Important rules:

- The question must match the selected interview type.
- The question must match the job role.
- The question must match the requested difficulty.
- Do not generate an answer.
- Do not include explanations.
- Do not include headings.
- Return ONLY the question text.
`;

    const question = await generateSingleQuestion(prompt);

    // ================= CREATE INTERVIEW =================

    const interview = new Interview({
      userId,
      company,
      role,
      type,
      difficulty,

      // Total questions selected by the user
      totalQuestions,

      // Difficulty of the current question
      currentDifficulty: difficulty,

      // Start with one question
      questions: [
        {
          question: question.trim(),
          difficulty,
        },
      ],

      startedAt: new Date(),
    });

    // ================= SAVE =================

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

// ============================================================
// GET MY INTERVIEWS
// ============================================================

const getMyInterviews = async (req, res) => {
  try {
    const userId = req.user.id;

    const interviews = await Interview.find({
      userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Get interviews error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET PERFORMANCE
// ============================================================

const getPerformance = async (req, res) => {
  try {
    const userId = req.user.id;

    const interviews = await Interview.find({
      userId,
    }).sort({
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
          totalScore / interview.qa.length;

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
        const interviewType =
          interview.type || "Unknown";

        if (!typeMap[interviewType]) {
          typeMap[interviewType] = {
            type: interviewType,
            interviews: 0,
            totalScore: 0,
          };
        }

        typeMap[interviewType].interviews += 1;

        typeMap[interviewType].totalScore +=
          averageScore;
      }
    );

    const performanceByType = Object.values(
      typeMap
    ).map((item) => ({
      type: item.type,
      interviews: item.interviews,
      averageScore: Number(
        (
          item.totalScore / item.interviews
        ).toFixed(1)
      ),
    }));

    // ================= PERFORMANCE BY DIFFICULTY =================

    const difficultyMap = {};

    interviewScores.forEach(
      ({ interview, averageScore }) => {
        const interviewDifficulty =
          interview.difficulty || "Unknown";

        if (!difficultyMap[interviewDifficulty]) {
          difficultyMap[interviewDifficulty] = {
            difficulty: interviewDifficulty,
            interviews: 0,
            totalScore: 0,
          };
        }

        difficultyMap[
          interviewDifficulty
        ].interviews += 1;

        difficultyMap[
          interviewDifficulty
        ].totalScore += averageScore;
      }
    );

    const performanceByDifficulty =
      Object.values(difficultyMap).map((item) => ({
        difficulty: item.difficulty,
        interviews: item.interviews,
        averageScore: Number(
          (
            item.totalScore / item.interviews
          ).toFixed(1)
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
        score: Number(
          averageScore.toFixed(1)
        ),
        durationSeconds:
          interview.durationSeconds || 0,
        completedAt:
          interview.endedAt ||
          interview.updatedAt,
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
        bestScore: Number(
          bestScore.toFixed(1)
        ),
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

// ============================================================
// GET INTERVIEW BY ID
// ============================================================

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
    console.error(
      "Get interview error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// UPDATE INTERVIEW
// ============================================================

const updateInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user.id;

    const interview =
      await Interview.findOneAndUpdate(
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
    console.error(
      "Update interview error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// DELETE INTERVIEW
// ============================================================

const deleteInterview = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const userId = req.user.id;

    const interview =
      await Interview.findOneAndDelete({
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
    console.error(
      "Delete interview error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// ADAPTIVE DIFFICULTY
// ============================================================

const getNextDifficulty = (
  currentDifficulty,
  score
) => {
  if (score >= 8) {
    if (currentDifficulty === "Easy") {
      return "Medium";
    }

    if (currentDifficulty === "Medium") {
      return "Hard";
    }

    return "Hard";
  }

  if (score <= 4) {
    if (currentDifficulty === "Hard") {
      return "Medium";
    }

    if (currentDifficulty === "Medium") {
      return "Easy";
    }

    return "Easy";
  }

  return currentDifficulty;
};

// ============================================================
// SUBMIT ONE ANSWER - ADAPTIVE INTERVIEW
// ============================================================

const submitAnswer = async (req, res) => {
  try {
    const interviewId = req.params.id;
    const { question, answer } = req.body;
    const userId = req.user.id;

    // ================= FIND INTERVIEW =================

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

    // ================= VALIDATE =================

    if (!question || !question.trim()) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    if (!answer || !answer.trim()) {
      return res.status(400).json({
        success: false,
        message: "Answer is required",
      });
    }

    // ================= EVALUATE ANSWER =================

    const evaluation = await evaluateAnswer(
      question,
      answer
    );

    // ================= SAVE EVALUATION =================

    interview.qa.push({
      question,
      answer,
      score: evaluation.score,
      feedback: evaluation.feedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
    });

    // ================= CHECK FINAL QUESTION =================

    const answeredQuestions =
      interview.qa.length;

    if (
      answeredQuestions >=
      interview.totalQuestions
    ) {
      // ================= OVERALL ASSESSMENT =================

      const overallAssessment =
        await generateOverallAssessment(
          interview.qa
        );

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

      // ================= COMPLETE INTERVIEW =================

      const endedAt = new Date();

      const durationSeconds = Math.floor(
        (endedAt - interview.startedAt) /
          1000
      );

      interview.endedAt = endedAt;
      interview.durationSeconds =
        durationSeconds;
      interview.status = "completed";

      await interview.save();

      return res.status(200).json({
        success: true,
        completed: true,
        message:
          "Interview completed successfully",
        evaluation,
        interview,
      });
    }

    // ================= NEXT DIFFICULTY =================

    const nextDifficulty =
      getNextDifficulty(
        interview.currentDifficulty,
        evaluation.score
      );

    interview.currentDifficulty =
      nextDifficulty;

    // ================= TYPE INSTRUCTION =================

    let typeInstruction = "";

    switch (interview.type) {
      case "Technical":
        typeInstruction = `
Focus on technical questions related to the role.
Test technical knowledge, concepts, tools,
technologies, and practical understanding.
`;
        break;

      case "HR":
        typeInstruction = `
Focus on HR interview questions about motivation,
career goals, strengths, weaknesses, company fit,
communication, and professional goals.
Do not generate technical questions.
`;
        break;

      case "Behavioral":
        typeInstruction = `
Focus on behavioral interview questions involving
past experiences, teamwork, leadership, conflict
resolution, problem solving, challenges, and achievements.
`;
        break;

      case "Coding":
        typeInstruction = `
Focus on coding and problem-solving questions,
algorithms, data structures, debugging,
and programming logic.
`;
        break;

      case "Panel":
        typeInstruction = `
Generate questions suitable for a panel interview.
Include a mixture of technical, behavioral,
situational, and role-related questions.
`;
        break;

      case "Group Discussion":
        typeInstruction = `
Generate discussion-oriented questions that test
communication, reasoning, teamwork, leadership,
and critical thinking.
`;
        break;

      case "Mixed":
        typeInstruction = `
Generate a balanced mixture of technical, HR,
behavioral, and role-specific questions.
`;
        break;

      default:
        typeInstruction = `
Generate a question appropriate for the
interview type.
`;
    }

    // ================= GENERATE NEXT QUESTION =================

    const prompt = `
You are an expert interviewer conducting a ${
      interview.type || "Technical"
    } interview.

Job Role:
${interview.role}

Company:
${interview.company || "Not specified"}

Interview Type:
${interview.type || "Technical"}

Current Difficulty:
${nextDifficulty}

${typeInstruction}

Generate exactly ONE interview question.

Important rules:

- The question must match the job role.
- The question must match the interview type.
- The question must match the requested difficulty.
- Do not repeat any previous question.
- Do not provide an answer.
- Do not provide explanations.
- Do not include headings.
- Return ONLY the question text.

Previous questions:
${interview.questions
  .map((item) => item.question)
  .join("\n")}
`;

    const nextQuestion =
      await generateSingleQuestion(prompt);

    // ================= SAVE NEXT QUESTION =================

    interview.questions.push({
      question: nextQuestion.trim(),
      difficulty: nextDifficulty,
    });

    await interview.save();

    // ================= RESPONSE =================

    return res.status(200).json({
      success: true,
      completed: false,

      evaluation,

      nextQuestion: {
        question: nextQuestion.trim(),
        difficulty: nextDifficulty,
      },

      currentQuestion:
        interview.questions.length - 1,

      totalQuestions:
        interview.totalQuestions,
    });
  } catch (error) {
    console.error(
      "Submit answer error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// COMPLETE INTERVIEW - LEGACY ENDPOINT
// ============================================================

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

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        message: "Answers must be an array",
      });
    }

    // ================= EVALUATE ALL ANSWERS =================

    const evaluations = await Promise.all(
      answers.map(async (item) => {
        const evaluation =
          await evaluateAnswer(
            item.question,
            item.answer
          );

        return {
          question: item.question,
          answer: item.answer,
          score: evaluation.score,
          feedback: evaluation.feedback,
          strengths: evaluation.strengths,
          improvements:
            evaluation.improvements,
        };
      })
    );

    // ================= SAVE EVALUATIONS =================

    interview.qa = evaluations;

    // ================= OVERALL ASSESSMENT =================

    const overallAssessment =
      await generateOverallAssessment(
        evaluations
      );

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

    // ================= COMPLETE =================

    const endedAt = new Date();

    const durationSeconds = Math.floor(
      (endedAt - interview.startedAt) /
        1000
    );

    interview.endedAt = endedAt;
    interview.durationSeconds =
      durationSeconds;
    interview.status = "completed";

    await interview.save();

    res.status(200).json({
      success: true,
      message:
        "Interview submitted successfully",
      interview,
    });
  } catch (error) {
    console.error(
      "Submit interview error:",
      error
    );

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// EXPORT
// ============================================================

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