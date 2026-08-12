import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Interviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [filteredInterviews, setFilteredInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // ================= FETCH INTERVIEWS =================

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/interviews");

      console.log("My Interviews:");
      console.log(response.data);

      const data = response.data.interviews || [];

      setInterviews(data);
      setFilteredInterviews(data);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load interviews. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= FILTER INTERVIEWS =================

  useEffect(() => {
    let result = [...interviews];

    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((interview) => {
        return (
          interview.role?.toLowerCase().includes(searchText) ||
          interview.company?.toLowerCase().includes(searchText) ||
          interview.type?.toLowerCase().includes(searchText)
        );
      });
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (interview) =>
          interview.status?.toLowerCase() ===
          statusFilter.toLowerCase()
      );
    }

    setFilteredInterviews(result);
  }, [search, statusFilter, interviews]);

  // ================= DELETE INTERVIEW =================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmed) return;

    try {
      await api.delete(`/interviews/${id}`);

      setInterviews((prev) =>
        prev.filter((interview) => interview._id !== id)
      );
    } catch (error) {
      console.error("Delete interview error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to delete interview."
      );
    }
  };

  // ================= STATUS LABEL =================

  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "Completed";

      case "in-progress":
        return "In Progress";

      case "paused":
        return "Paused";

      case "cancelled":
        return "Cancelled";

      default:
        return status || "Unknown";
    }
  };

  // ================= STATUS STYLE =================

  const getStatusStyle = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";

      case "in-progress":
        return "bg-orange-100 text-orange-700";

      case "paused":
        return "bg-yellow-100 text-yellow-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-3 text-4xl">📋</div>

          <h2 className="text-lg font-semibold text-gray-800">
            Loading interviews...
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Please wait while we load your interview history.
          </p>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mb-3 text-4xl">⚠️</div>

          <h2 className="text-xl font-bold text-gray-900">
            Unable to load interviews
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={fetchInterviews}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-2xl">
                📋
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  My Interviews
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                  View and manage your interview history.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate("/create-interview")}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            + Create Interview
          </button>
        </div>

        {/* ================= SEARCH + FILTER ================= */}

        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row">

            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                🔍
              </span>

              <input
                type="text"
                placeholder="Search by role, company, or interview type..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="All">All Status</option>
              <option value="completed">Completed</option>
              <option value="in-progress">In Progress</option>
              <option value="paused">Paused</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* ================= RESULT COUNT ================= */}

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-700">
              {filteredInterviews.length}
            </span>{" "}
            interview
            {filteredInterviews.length !== 1 ? "s" : ""}
          </p>

          {(search || statusFilter !== "All") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("All");
              }}
              className="text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* ================= NO INTERVIEWS ================= */}

        {filteredInterviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mb-4 text-5xl">📋</div>

            <h2 className="text-xl font-bold text-gray-900">
              No interviews found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">
              {search || statusFilter !== "All"
                ? "Try changing your search or filter."
                : "You haven't created any interviews yet."}
            </p>

            <button
              onClick={() => navigate("/create-interview")}
              className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white transition hover:bg-blue-700"
            >
              Create Interview
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInterviews.map((interview) => {
              const isCompleted =
                interview.status === "completed";

              return (
                <div
                  key={interview._id}
                  className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                >
                  {/* ================= TOP ================= */}

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">
                        {interview.role || "Interview"}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {interview.company ||
                          "Company not specified"}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                        interview.status
                      )}`}
                    >
                      {getStatusLabel(interview.status)}
                    </span>
                  </div>

                  {/* ================= DETAILS ================= */}

                  <div className="mt-5 grid grid-cols-2 gap-4 border-y border-gray-100 py-4 sm:grid-cols-4">
                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Interview Type
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {interview.type || "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Difficulty
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {interview.difficulty ||
                          "Not specified"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Questions
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {interview.questions?.length || 0}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-gray-400">
                        Created
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-700">
                        {interview.createdAt
                          ? new Date(
                              interview.createdAt
                            ).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  {/* ================= ACTIONS ================= */}

                  <div className="flex flex-wrap gap-3 pt-4">
                    {isCompleted ? (
                      <button
                        onClick={() =>
                          navigate(
                            `/interview-result/${interview._id}`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Result
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          navigate(
                            `/interview/${interview._id}`
                          )
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        Continue Interview
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(interview._id)
                      }
                      className="rounded-lg border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      🗑 Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Interviews;