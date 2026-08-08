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

  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed"
  ).length;

  const inProgressInterviews = interviews.filter(
    (interview) => interview.status === "in-progress"
  ).length;

  const filteredInterviews = interviews.filter((interview) => {
    const matchesSearch = interview.role
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || interview.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get("/interviews");
      setInterviews(response.data.interviews);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteInterview = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this interview?"
    );

    if (!confirmDelete) return;

    try {
      await api.delete(`/interviews/${id}`);

      setInterviews((prevInterviews) =>
        prevInterviews.filter((interview) => interview._id !== id)
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
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

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-3">

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
        </div>

        {/* Interviews Section */}
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
                          navigate(`/interview/${interview._id}`)
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