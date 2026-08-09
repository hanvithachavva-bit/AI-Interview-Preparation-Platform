import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

function InterviewResult() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInterview();
  }, []);

  const fetchInterview = async () => {
    try {
      setError("");

      const response = await api.get(`/interviews/${id}`);

      console.log(response.data);

      setInterview(response.data.interview);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load interview results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-lg font-medium text-gray-600">
          Loading results...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-red-600">{error}</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-6">
        <div className="rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-gray-700">Interview not found.</p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const totalScore = interview.qa.reduce(
    (sum, item) => sum + item.score,
    0
  );

  const maximumScore = interview.questions.length * 10;

  const percentage =
    maximumScore > 0
      ? Math.round((totalScore / maximumScore) * 100)
      : 0;

  let performance;
  let performanceStyle;

  if (percentage >= 80) {
    performance = "Excellent Performance! 🎉";
    performanceStyle = "text-green-600";
  } else if (percentage >= 60) {
    performance = "Good Performance! 👍";
    performanceStyle = "text-blue-600";
  } else if (percentage >= 40) {
    performance = "Keep Practicing! 💪";
    performanceStyle = "text-orange-600";
  } else {
    performance = "Needs Improvement 📚";
    performanceStyle = "text-red-600";
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 rounded-xl bg-white p-6 text-center shadow-sm">
          <div className="mb-2 text-4xl">🎉</div>

          <h1 className="text-3xl font-bold text-gray-900">
            Interview Completed
          </h1>

          <p className="mt-2 text-gray-500">
            Here is your interview performance summary.
          </p>
        </div>

        {/* Interview Information */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {interview.role}
              </h2>

              <p className="mt-1 text-gray-500">
                Difficulty:{" "}
                <span className="font-semibold capitalize text-gray-700">
                  {interview.difficulty}
                </span>
              </p>
            </div>

            <span className="w-fit rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              Completed
            </span>
          </div>
        </div>

        {/* Overall Score */}
        <div className="mb-8 rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-medium uppercase tracking-wide text-gray-500">
            Overall Score
          </p>

          <h2 className="mt-2 text-5xl font-bold text-gray-900">
            {totalScore}
            <span className="text-2xl text-gray-400">
              {" "}
              / {maximumScore}
            </span>
          </h2>

          <p className={`mt-3 text-xl font-bold ${performanceStyle}`}>
            {performance}
          </p>

          {/* Percentage */}
          <div className="mx-auto mt-6 max-w-xl">
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-gray-600">
                Performance
              </span>

              <span className="font-bold text-gray-800">
                {percentage}%
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all ${
                  percentage >= 80
                    ? "bg-green-500"
                    : percentage >= 60
                    ? "bg-blue-500"
                    : percentage >= 40
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question Results */}
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Question Results
          </h2>

          <div className="space-y-5">
            {interview.qa.map((item, index) => (
              <div
                key={index}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                {/* Question Header */}
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Question {index + 1}
                  </h3>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-bold ${
                      item.score >= 8
                        ? "bg-green-100 text-green-700"
                        : item.score >= 5
                        ? "bg-orange-100 text-orange-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {item.score}/10
                  </span>
                </div>

                {/* Question */}
                <div className="mt-5">
                  <p className="mb-2 text-sm font-semibold text-gray-500">
                    Question
                  </p>

                  <p className="leading-relaxed text-gray-800">
                    {item.question}
                  </p>
                </div>

                {/* Answer */}
                <div className="mt-5 rounded-lg bg-gray-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-gray-500">
                    Your Answer
                  </p>

                  <p className="leading-relaxed text-gray-700">
                    {item.answer || "No answer provided."}
                  </p>
                </div>

                {/* Strengths */}
                <div className="mt-5 rounded-lg border border-green-100 bg-green-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-green-700">
                    💪 What You Did Well
                  </p>

                  <p className="leading-relaxed text-gray-700">
                    {item.strengths || "No specific strengths identified."}
                  </p>
                </div>

                {/* Improvements */}
                <div className="mt-5 rounded-lg border border-orange-100 bg-orange-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-orange-700">
                    ⚠️ How to Improve
                  </p>

                  <p className="leading-relaxed text-gray-700">
                    {item.improvements ||
                      "No specific improvements identified."}
                  </p>
                </div>

                {/* Feedback */}
                <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                  <p className="mb-2 text-sm font-semibold text-blue-700">
                    💡 Feedback
                  </p>

                  <p className="leading-relaxed text-gray-700">
                    {item.feedback}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex flex-col justify-center gap-3 pb-8 sm:flex-row">
          <button
            onClick={() => navigate("/dashboard")}
            className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
          >
            🏠 Back to Dashboard
          </button>

          <button
            onClick={() => navigate("/create-interview")}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            🔄 Create New Interview
          </button>
        </div>
      </div>
    </div>
  );
}

export default InterviewResult;