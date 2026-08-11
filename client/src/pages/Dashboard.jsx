import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteError, setDeleteError] = useState("");

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
    // Newest interview first
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  // ================= FILTERED INTERVIEWS =================

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.role
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || interview.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  // ================= DELETE INTERVIEW =================

  const handleDeleteInterview = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmDelete) return;

    try {
      setDeleteError("");

      await api.delete(`/interviews/${id}`);

      setInterviews((prevInterviews) =>
        prevInterviews.filter(
          (interview) => interview._id !== id
        )
      );
    } catch (error) {
      console.error(error);

      setDeleteError(
        error.response?.data?.message ||
          "Failed to delete interview. Please try again."
      );
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-lg font-medium text-gray-600">
          Loading interviews...
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

          {/* Total */}
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

                      {/* Date + Time */}
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

        {/* ================= INTERVIEWS SECTION ================= */}

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900">
              Your Interviews
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              View and manage your interview sessions.
            </p>
          </div>

          {/* Search + Filter */}
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              placeholder="🔍 Search by role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:max-w-md"
            />

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="All">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
            </select>
          </div>

          {/* Delete Error */}
          {deleteError && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
              {deleteError}
            </div>
          )}

          {/* Interview List */}
          {filteredInterviews.length === 0 ? (
            <div className="rounded-lg border border-dashed border-gray-300 py-12 text-center">
              <div className="mb-3 text-4xl">📭</div>

              <h4 className="text-lg font-semibold text-gray-700">
                No interviews found
              </h4>

              <p className="mt-1 text-sm text-gray-500">
                Try changing your search or create a new interview.
              </p>
            </div>
          ) : (
            <div className="space-y-4">

              {filteredInterviews.map((interview) => (
                <div
                  key={interview._id}
                  className="rounded-xl border border-gray-200 p-5 transition hover:border-blue-300 hover:shadow-md"
                >

                  {/* Interview Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                      <h4 className="text-xl font-semibold text-gray-900">
                        {interview.role}
                      </h4>

                      <p className="mt-1 text-sm text-gray-500">
                        📅 Created{" "}
                        {new Date(
                          interview.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`w-fit rounded-full px-3 py-1 text-sm font-semibold ${
                        interview.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : "bg-orange-100 text-orange-700"
                      }`}
                    >
                      {interview.status === "completed"
                        ? "Completed"
                        : "In Progress"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="mt-4">
                    <span className="text-sm text-gray-500">
                      Difficulty
                    </span>

                    <p className="font-medium capitalize text-gray-800">
                      {interview.difficulty}
                    </p>
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex flex-wrap gap-3">

                    {interview.status === "completed" ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/interview-result/${interview._id}`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                      >
                        📄 View Result
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(
                            `/interview/${interview._id}`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700"
                      >
                        ▶ Continue Interview
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDeleteInterview(interview._id)
                      }
                      className="rounded-lg border border-red-300 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;