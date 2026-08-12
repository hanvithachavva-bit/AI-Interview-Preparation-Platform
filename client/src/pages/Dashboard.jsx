import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= STATISTICS =================

  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed"
  ).length;

  const inProgressInterviews = interviews.filter(
    (interview) => interview.status === "in-progress"
  ).length;

  // Only completed interviews with questions and answers
  const completedInterviewData = interviews.filter(
    (interview) =>
      interview.status === "completed" &&
      interview.questions?.length > 0 &&
      interview.qa?.length > 0
  );

  // ================= AVERAGE SCORE =================

  const averageScore =
    completedInterviewData.length > 0
      ? Math.round(
          completedInterviewData.reduce((sum, interview) => {
            const totalScore = interview.qa.reduce(
              (qaSum, item) => qaSum + (item.score || 0),
              0
            );

            const maximumScore = interview.questions.length * 10;

            return (
              sum +
              (maximumScore > 0
                ? (totalScore / maximumScore) * 100
                : 0)
            );
          }, 0) / completedInterviewData.length
        )
      : 0;

  // ================= BEST SCORE =================

  const bestScore =
    completedInterviewData.length > 0
      ? Math.max(
          ...completedInterviewData.map((interview) => {
            const totalScore = interview.qa.reduce(
              (sum, item) => sum + (item.score || 0),
              0
            );

            const maximumScore = interview.questions.length * 10;

            return maximumScore > 0
              ? Math.round((totalScore / maximumScore) * 100)
              : 0;
          })
        )
      : 0;

  // ================= AVERAGE DURATION =================

  const averageDuration =
    completedInterviewData.length > 0
      ? Math.round(
          completedInterviewData.reduce(
            (sum, interview) =>
              sum + (interview.durationSeconds || 0),
            0
          ) / completedInterviewData.length
        )
      : 0;

  const averageMinutes = Math.floor(averageDuration / 60);
  const averageSeconds = averageDuration % 60;

  // ================= PERFORMANCE DATA =================

  const performanceData = completedInterviewData
    .map((interview) => {
      const validScores = interview.qa.filter(
        (item) => item.score !== undefined && item.score !== null
      );

      const totalScore = validScores.reduce(
        (sum, item) => sum + Number(item.score || 0),
        0
      );

      const maximumScore = validScores.length * 10;

      const percentage =
        maximumScore > 0
          ? Math.round((totalScore / maximumScore) * 100)
          : 0;

      return {
        id: interview._id,
        role: interview.role,
        percentage,
        date: interview.createdAt,
      };
    })
    .filter((interview) => interview.percentage > 0)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // ================= FETCH INTERVIEWS =================

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setError("");

      const response = await api.get("/interviews");

      setInterviews(response.data.interviews);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
          "Failed to load interviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Loading dashboard...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            {error}
          </p>

          <button
            onClick={() => {
              setLoading(true);
              fetchInterviews();
            }}
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              AI Interview Preparation
            </h1>

            <h2 className="mt-2 text-lg text-gray-600">
              Welcome, {user ? user.fullName : "User"} 👋
            </h2>
          </div>

          <button
            onClick={() => navigate("/create-interview")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Create Interview
          </button>
        </div>

        {/* ================= STATISTICS ================= */}

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {/* Total Interviews */}

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Total Interviews
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {totalInterviews}
                </p>
              </div>

              <div className="text-3xl">📋</div>
            </div>
          </div>

          {/* Completed */}

          <div className="rounded-xl border border-green-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {completedInterviews}
                </p>
              </div>

              <div className="text-3xl">✅</div>
            </div>
          </div>

          {/* In Progress */}

          <div className="rounded-xl border border-orange-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">
                  In Progress
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {inProgressInterviews}
                </p>
              </div>

              <div className="text-3xl">⏳</div>
            </div>
          </div>

          {/* Average Score */}

          <div className="rounded-xl border border-blue-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">
                  Average Score
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {averageScore}%
                </p>
              </div>

              <div className="text-3xl">📊</div>
            </div>
          </div>

          {/* Best Score */}

          <div className="rounded-xl border border-purple-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">
                  Best Score
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {bestScore}%
                </p>
              </div>

              <div className="text-3xl">🏆</div>
            </div>
          </div>

          {/* Average Duration */}

          <div className="rounded-xl border border-indigo-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600">
                  Average Duration
                </p>

                <p className="mt-2 text-3xl font-bold text-gray-900">
                  {averageMinutes}m {averageSeconds}s
                </p>
              </div>

              <div className="text-3xl">⏱️</div>
            </div>
          </div>
        </div>

        {/* ================= PERFORMANCE OVERVIEW ================= */}

        <div className="mb-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Performance Overview
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Track your performance across completed interviews.
            </p>
          </div>

          {performanceData.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-10 text-center">
              <div className="mb-3 text-4xl">📈</div>

              <h4 className="text-lg font-semibold text-gray-700">
                No performance data yet
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Complete an interview to see your performance here.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {performanceData.map((item) => (
                <div key={item.id}>

                  {/* Role + Score */}

                  <div className="mb-2 flex items-end justify-between gap-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {item.role}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(item.date).toLocaleString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    <span
                      className={`font-bold ${
                        item.percentage >= 80
                          ? "text-green-600"
                          : item.percentage >= 60
                          ? "text-blue-600"
                          : item.percentage >= 40
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}

                  <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className={`h-full rounded-full transition-all ${
                        item.percentage >= 80
                          ? "bg-green-500"
                          : item.percentage >= 60
                          ? "bg-blue-500"
                          : item.percentage >= 40
                          ? "bg-orange-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${item.percentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= QUICK ACTIONS ================= */}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <h3 className="text-2xl font-bold text-gray-900">
            Quick Actions
          </h3>

          <p className="mt-1 text-sm text-gray-500">
            Quickly access the main features of your interview platform.
          </p>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

            {/* Create Interview */}

            <button
              onClick={() => navigate("/create-interview")}
              className="rounded-xl border border-blue-200 bg-blue-50 p-5 text-left transition hover:border-blue-400 hover:bg-blue-100"
            >
              <div className="text-3xl">🎯</div>

              <h4 className="mt-3 font-semibold text-gray-900">
                Create Interview
              </h4>

              <p className="mt-1 text-sm text-gray-600">
                Start a new AI-powered mock interview.
              </p>
            </button>

            {/* My Interviews */}

            <button
              onClick={() => navigate("/interviews")}
              className="rounded-xl border border-purple-200 bg-purple-50 p-5 text-left transition hover:border-purple-400 hover:bg-purple-100"
            >
              <div className="text-3xl">📋</div>

              <h4 className="mt-3 font-semibold text-gray-900">
                My Interviews
              </h4>

              <p className="mt-1 text-sm text-gray-600">
                View and manage all your interview sessions.
              </p>
            </button>

            {/* Resume Matcher */}

            <button
              onClick={() => navigate("/resume-matcher")}
              className="rounded-xl border border-green-200 bg-green-50 p-5 text-left transition hover:border-green-400 hover:bg-green-100"
            >
              <div className="text-3xl">📄</div>

              <h4 className="mt-3 font-semibold text-gray-900">
                Resume Matcher
              </h4>

              <p className="mt-1 text-sm text-gray-600">
                Compare your resume with a job description.
              </p>
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;