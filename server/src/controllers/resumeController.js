const { analyzeResume } = require("../services/geminiService");
const {
  extractResumeText,
} = require("../services/resumeParserService");

const analyzeResumeMatch = async (req, res) => {
  try {
    const { jobDescription } = req.body;

    let resume;

    // ================= RESUME FILE =================

    if (req.file) {

      resume = await extractResumeText(req.file);
    }

    // ================= RESUME TEXT =================

    else {
      resume = req.body.resume;
    }

    // ================= VALIDATE INPUT =================

    if (typeof resume !== "string" || !resume.trim()) {
      return res.status(400).json({
        success: false,
        message: "Resume is required.",
      });
    }

    if (
      typeof jobDescription !== "string" ||
      !jobDescription.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Job description is required.",
      });
    }

    // ================= GEMINI ANALYSIS =================

    const analysis = await analyzeResume(
      resume,
      jobDescription
    );
    // ================= RESPONSE =================

    res.status(200).json({
      success: true,
      message: "Resume analyzed successfully",
      analysis,
    });
  } catch (error) {
    console.error("Resume analysis error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  analyzeResumeMatch,
};