import { useEffect, useState } from "react";
import api from "../services/api";

function Performance() {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/interviews/performance");

      setPerformance(response.data);
    } catch (error) {
      console.error("Performance error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load performance data. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500 text-lg">
              Loading performance...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center mt-8">
            <div className="text-4xl mb-4">⚠️</div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Unable to load performance
            </h2>

            <p className="text-red-500 mb-5">
              {error}
            </p>

            <button
              onClick={fetchPerformance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const overview = performance?.overview || {};

  const performanceByType =
    performance?.performanceByType || [];

  const performanceByDifficulty =
    performance?.performanceByDifficulty || [];

  const recentPerformance =
    performance?.recentPerformance || [];

  // ================= FORMAT DURATION =================

  const formatDuration = (seconds) => {
    if (!seconds || seconds <= 0) {
      return "0m 0s";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${minutes}m ${remainingSeconds}s`;
  };

  // ================= FORMAT DATE =================

  const formatDate = (date) => {
    if (!date) {
      return "Not available";
    }

    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Performance
          </h1>

          <p className="text-gray-500 mt-2">
            Track your interview performance and progress.
          </p>
        </div>

        {/* ================= OVERVIEW ================= */}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">

          {/* Total Interviews */}

          <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-2">
              Total Interviews
            </p>

            <p className="text-3xl font-bold text-gray-900">
              {overview.totalInterviews || 0}
            </p>
          </div>

          {/* Completed */}

          <div className="bg-white rounded-xl border border-green-200 p-6 shadow-sm">
            <p className="text-sm text-green-600 mb-2">
              Completed
            </p>

            <p className="text-3xl font-bold text-gray-900">
              {overview.completedInterviews || 0}
            </p>
          </div>

          {/* In Progress */}

          <div className="bg-white rounded-xl border border-orange-200 p-6 shadow-sm">
            <p className="text-sm text-orange-500 mb-2">
              In Progress
            </p>

            <p className="text-3xl font-bold text-gray-900">
              {overview.inProgressInterviews || 0}
            </p>
          </div>

          {/* Average Score */}

          <div className="bg-white rounded-xl border border-blue-200 p-6 shadow-sm">
            <p className="text-sm text-blue-600 mb-2">
              Average Score
            </p>

            <p className="text-3xl font-bold text-gray-900">
              {overview.averageScore || 0}
            </p>
          </div>

          {/* Best Score */}

          <div className="bg-white rounded-xl border border-purple-200 p-6 shadow-sm">
            <p className="text-sm text-purple-600 mb-2">
              Best Score
            </p>

            <p className="text-3xl font-bold text-gray-900">
              {overview.bestScore || 0}
            </p>
          </div>

          {/* Average Duration */}

          <div className="bg-white rounded-xl border border-indigo-200 p-6 shadow-sm">
            <p className="text-sm text-indigo-600 mb-2">
              Average Duration
            </p>

            <p className="text-3xl font-bold text-gray-900">
              {formatDuration(
                overview.averageDurationSeconds
              )}
            </p>
          </div>
        </div>

        {/* ================= PERFORMANCE BY TYPE ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Performance by Interview Type
          </h2>

          {performanceByType.length === 0 ? (
            <p className="text-gray-500">
              No completed interviews available yet.
            </p>
          ) : (
            <div className="space-y-5">

              {performanceByType.map((item) => (
                <div key={item.type}>

                  <div className="flex justify-between items-center mb-2">

                    <span className="font-medium text-gray-700">
                      {item.type}
                    </span>

                    <span className="font-semibold text-blue-600">
                      {item.averageScore}
                    </span>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-blue-600 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          item.averageScore * 10,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="text-xs text-gray-400 mt-1">
                    {item.interviews} interview
                    {item.interviews !== 1 ? "s" : ""}
                  </p>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= PERFORMANCE BY DIFFICULTY ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Performance by Difficulty
          </h2>

          {performanceByDifficulty.length === 0 ? (
            <p className="text-gray-500">
              No completed interviews available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

              {performanceByDifficulty.map((item) => (
                <div
                  key={item.difficulty}
                  className="border border-gray-200 rounded-lg p-5"
                >

                  <p className="text-gray-500 text-sm mb-2">
                    {item.difficulty}
                  </p>

                  <p className="text-2xl font-bold text-gray-900">
                    {item.averageScore}
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {item.interviews} interview
                    {item.interviews !== 1 ? "s" : ""}
                  </p>

                </div>
              ))}
            </div>
          )}
        </div>

        {/* ================= RECENT PERFORMANCE ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">

          <h2 className="text-xl font-bold text-gray-900 mb-5">
            Recent Performance
          </h2>

          {recentPerformance.length === 0 ? (
            <p className="text-gray-500">
              No completed interviews available yet.
            </p>
          ) : (
            <div className="space-y-4">

              {recentPerformance.map((item) => (
                <div
                  key={item.id}
                  className="border border-gray-200 rounded-lg p-5"
                >

                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>

                      <h3 className="font-semibold text-gray-900">
                        {item.role}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.company || "Company not specified"}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-3">

                        <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
                          {item.type || "Unknown"}
                        </span>

                        <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                          {item.difficulty}
                        </span>

                      </div>

                    </div>

                    <div className="text-left md:text-right">

                      <p className="text-2xl font-bold text-green-600">
                        {item.score}
                      </p>

                      <p className="text-sm text-gray-500">
                        {formatDuration(
                          item.durationSeconds
                        )}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(item.completedAt)}
                      </p>

                    </div>

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

export default Performance;