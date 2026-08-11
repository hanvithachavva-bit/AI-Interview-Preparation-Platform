import { useState } from "react";
import api from "../services/api";

function ResumeMatcher() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeFile, setResumeFile] = useState(null);

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Only PDF and DOCX files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume file must be smaller than 5 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setResumeFile(file);

    // Clear pasted resume text when a file is selected
    setResume("");
  };

  const removeResumeFile = () => {
    setResumeFile(null);

    const fileInput = document.getElementById("resumeFile");

    if (fileInput) {
      fileInput.value = "";
    }
  };

  const handleResumeTextChange = (e) => {
    setResume(e.target.value);

    // If the user starts pasting, remove the selected file
    if (e.target.value.trim()) {
      setResumeFile(null);

      const fileInput = document.getElementById("resumeFile");

      if (fileInput) {
        fileInput.value = "";
      }
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();

    if (!resumeFile && !resume.trim()) {
      setError("Please upload a resume or paste your resume text.");
      return;
    }

    if (!jobDescription.trim()) {
      setError("Job description is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const formData = new FormData();

    // If PDF/DOCX is selected
      if (resumeFile) {
        formData.append("resume", resumeFile);
      } else {
        // If user pasted resume text
        formData.append("resume", resume);
      }

      formData.append("jobDescription", jobDescription);

      const response = await api.post(
        "/resume/analyze",
        formData
      );

      console.log("Resume Analysis:");
      console.log(response.data);

      setAnalysis(response.data.analysis);
    } catch (error) {
      console.error("Resume analysis error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to analyze resume. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getProgressColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-blue-500";
    if (score >= 40) return "bg-orange-500";
    return "bg-red-500";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) {
      return "Excellent match! Your resume aligns strongly with this job.";
    }

    if (score >= 60) {
      return "Good match! You have several relevant skills, but there are areas you can improve.";
    }

    if (score >= 40) {
      return "Moderate match. Consider improving your resume and adding more relevant skills.";
    }

    return "Low match. Review the missing skills and improve your resume for this role.";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Resume & Job Matcher
          </h1>

          <p className="mt-2 text-gray-500">
            Compare your resume with a job description using AI.
          </p>
        </div>

        {/* ================= INPUT SECTION ================= */}

        <form onSubmit={handleAnalyze}>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

            {/* ================= RESUME ================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Your Resume
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Paste your resume or upload a PDF/DOCX file.
                </p>
              </div>

              {/* Upload */}

              <div className="mb-4 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-5 text-center">

                <p className="mb-3 text-sm font-medium text-gray-600">
                  📄 Upload Resume
                </p>

                <input
                  id="resumeFile"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="mx-auto block w-full max-w-md text-sm text-gray-600"
                />

                <p className="mt-2 text-xs text-gray-400">
                  PDF or DOCX • Maximum 5 MB
                </p>
              </div>

              {/* Selected File */}

              {resumeFile && (
                <div className="mb-4 flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-3">

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-green-700">
                      📄 {resumeFile.name}
                    </p>

                    <p className="text-xs text-green-600">
                      {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={removeResumeFile}
                    className="ml-3 rounded-lg px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    Remove
                  </button>
                </div>
              )}

              {/* Divider */}

              <div className="my-5 flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200"></div>

                <span className="text-xs font-medium text-gray-400">
                  OR PASTE TEXT
                </span>

                <div className="h-px flex-1 bg-gray-200"></div>
              </div>

              {/* Resume Text */}

              <textarea
                value={resume}
                onChange={handleResumeTextChange}
                placeholder="Paste your resume here..."
                className="h-64 w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {resume.length} characters
              </p>
            </div>

            {/* ================= JOB DESCRIPTION ================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Job Description
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Paste the job description you want to match.
                </p>
              </div>

              <textarea
                value={jobDescription}
                onChange={(e) =>
                  setJobDescription(e.target.value)
                }
                placeholder="Paste the job description here..."
                className="h-80 w-full resize-none rounded-lg border border-gray-300 p-4 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />

              <p className="mt-2 text-right text-xs text-gray-400">
                {jobDescription.length} characters
              </p>
            </div>
          </div>

          {/* ================= ERROR ================= */}

          {error && (
            <div className="mx-auto mt-6 max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-center text-sm font-medium text-red-700">
              ⚠️ {error}
            </div>
          )}

          {/* ================= ANALYZE BUTTON ================= */}

          <div className="mt-8 flex justify-center">
            <button
              type="submit"
              disabled={
                loading ||
                (!resume.trim() && !resumeFile) ||
                !jobDescription.trim()
              }
              className="rounded-lg bg-blue-600 px-8 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              {loading
                ? "🤖 Analyzing Resume..."
                : "🤖 Analyze Resume"}
            </button>
          </div>
        </form>

        {/* ================= RESULTS ================= */}

        {analysis && (
          <div className="mt-10 space-y-6">

            {/* ================= MATCH SCORE ================= */}

            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">

              <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
                Resume Match Score
              </p>

              <h2
                className={`mt-2 text-6xl font-bold ${getScoreColor(
                  analysis.matchPercentage
                )}`}
              >
                {analysis.matchPercentage}%
              </h2>

              <p className="mt-3 text-lg font-semibold text-gray-700">
                {getScoreMessage(analysis.matchPercentage)}
              </p>

              <div className="mx-auto mt-6 max-w-xl">
                <div className="h-4 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ${getProgressColor(
                      analysis.matchPercentage
                    )}`}
                    style={{
                      width: `${Math.min(
                        Math.max(analysis.matchPercentage, 0),
                        100
                      )}%`,
                    }}
                  ></div>
                </div>
              </div>

              {analysis.summary && (
                <div className="mx-auto mt-6 max-w-3xl rounded-lg bg-blue-50 p-4 text-left">
                  <p className="mb-2 font-semibold text-blue-700">
                    📊 AI Summary
                  </p>

                  <p className="leading-relaxed text-gray-700">
                    {analysis.summary}
                  </p>
                </div>
              )}
            </div>

            {/* ================= SKILLS ================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Matching Skills */}

              <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-green-700">
                  ✅ Matching Skills
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Skills from your resume that match the job.
                </p>

                {analysis.matchingSkills?.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {analysis.matchingSkills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-green-100 px-3 py-2 text-sm font-medium text-green-700"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-5 text-gray-500">
                    No matching skills identified.
                  </p>
                )}
              </div>

              {/* Missing Skills */}

              <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-orange-700">
                  ⚠️ Missing Skills
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Skills required by the job that are not clearly shown
                  in your resume.
                </p>

                {analysis.missingSkills?.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {analysis.missingSkills.map(
                      (skill, index) => (
                        <span
                          key={index}
                          className="rounded-full bg-orange-100 px-3 py-2 text-sm font-medium text-orange-700"
                        >
                          {skill}
                        </span>
                      )
                    )}
                  </div>
                ) : (
                  <p className="mt-5 text-gray-500">
                    🎉 No major missing skills identified.
                  </p>
                )}
              </div>
            </div>

            {/* ================= STRENGTHS + IMPROVEMENTS ================= */}

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* Strengths */}

              <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-blue-700">
                  💪 Strengths
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  What your resume already does well for this job.
                </p>

                {analysis.strengths?.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {analysis.strengths.map(
                      (strength, index) => (
                        <li
                          key={index}
                          className="rounded-lg bg-blue-50 p-3 text-gray-700"
                        >
                          <span className="mr-2 font-bold text-blue-600">
                            ✓
                          </span>

                          {strength}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="mt-5 text-gray-500">
                    No significant strengths identified.
                  </p>
                )}
              </div>

              {/* Improvements */}

              <div className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">

                <h3 className="text-xl font-bold text-purple-700">
                  💡 Areas to Improve
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Changes that could make your resume stronger.
                </p>

                {analysis.improvements?.length > 0 ? (
                  <ul className="mt-5 space-y-3">
                    {analysis.improvements.map(
                      (improvement, index) => (
                        <li
                          key={index}
                          className="rounded-lg bg-purple-50 p-3 text-gray-700"
                        >
                          <span className="mr-2 font-bold text-purple-600">
                            →
                          </span>

                          {improvement}
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="mt-5 text-gray-500">
                    No major improvements identified.
                  </p>
                )}
              </div>
            </div>

            {/* ================= RECOMMENDED SKILLS ================= */}

            <div className="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm">

              <h3 className="text-xl font-bold text-indigo-700">
                🎯 Recommended Skills to Learn
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Focus on these skills to improve your match with this job.
              </p>

              {analysis.missingSkills?.length > 0 ? (
                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {analysis.missingSkills.map(
                    (skill, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-indigo-100 bg-indigo-50 p-4"
                      >
                        <p className="font-semibold text-indigo-700">
                          {index + 1}. {skill}
                        </p>

                        <p className="mt-1 text-sm text-gray-600">
                          Consider learning or strengthening this skill
                          for the target role.
                        </p>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div className="mt-5 rounded-lg bg-green-50 p-4 text-green-700">
                  🎉 Your resume already covers the major skills
                  identified in the job description.
                </div>
              )}
            </div>

            {/* ================= FINAL TIP ================= */}

            <div className="rounded-xl border border-gray-200 bg-gray-900 p-6 text-white shadow-sm">

              <h3 className="text-xl font-bold">
                🚀 Next Step
              </h3>

              <p className="mt-2 leading-relaxed text-gray-300">
                Use this analysis to update your resume with relevant
                skills, projects, and experience that match the job
                description. Focus especially on the missing skills
                identified above.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default ResumeMatcher;