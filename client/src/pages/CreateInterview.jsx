import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateInterview() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    type: "Technical",
    difficulty: "Easy",
    numberOfQuestions: 5,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ================= HANDLE INPUT CHANGES =================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= HANDLE SUBMIT =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Basic validation
    if (!formData.role.trim()) {
      setError("Please enter a job role.");
      return;
    }

    if (
      formData.numberOfQuestions < 1 ||
      formData.numberOfQuestions > 20
    ) {
      setError("Number of questions must be between 1 and 20.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/interviews", {
        ...formData,
        numberOfQuestions: Number(formData.numberOfQuestions),
      });

      console.log("Interview created:");
      console.log(response.data);

      navigate(`/interview/${response.data.interview._id}`);
    } catch (error) {
      console.error("Create interview error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to generate interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-3xl">
            🎯
          </div>

          <h1 className="text-3xl font-bold text-gray-900">
            Create Interview
          </h1>

          <p className="mt-2 text-gray-500">
            Customize your AI-powered mock interview.
          </p>
        </div>

        {/* ================= FORM CARD ================= */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">

          <form onSubmit={handleSubmit}>

            {/* ================= COMPANY ================= */}

            <div className="mb-6">
              <label
                htmlFor="company"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Company
                <span className="ml-1 text-xs font-normal text-gray-400">
                  (Optional)
                </span>
              </label>

              <input
                id="company"
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Enter the company you're preparing for, if applicable.
              </p>
            </div>

            {/* ================= JOB ROLE ================= */}

            <div className="mb-6">
              <label
                htmlFor="role"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Job Role
                <span className="ml-1 text-red-500">*</span>
              </label>

              <input
                id="role"
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            {/* ================= INTERVIEW TYPE ================= */}

            <div className="mb-6">
              <label
                htmlFor="type"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Interview Type
              </label>

              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Technical">Technical</option>
                <option value="HR">HR</option>
                <option value="Behavioral">Behavioral</option>
                <option value="Coding">Coding</option>
                <option value="Panel">Panel</option>
                <option value="Group Discussion">
                  Group Discussion
                </option>
                <option value="Mixed">Mixed</option>
              </select>
            </div>

            {/* ================= DIFFICULTY ================= */}

            <div className="mb-6">
              <label
                htmlFor="difficulty"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Difficulty
              </label>

              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            {/* ================= NUMBER OF QUESTIONS ================= */}

            <div className="mb-6">
              <label
                htmlFor="numberOfQuestions"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Number of Questions
              </label>

              <input
                id="numberOfQuestions"
                type="number"
                name="numberOfQuestions"
                value={formData.numberOfQuestions}
                onChange={handleChange}
                min="1"
                max="20"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

              <p className="mt-1.5 text-xs text-gray-400">
                Choose between 1 and 20 questions.
              </p>
            </div>

            {/* ================= ERROR ================= */}

            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
                ⚠️ {error}
              </div>
            )}

            {/* ================= ACTIONS ================= */}

            <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:justify-end">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={loading}
                className="rounded-lg border border-gray-300 bg-white px-5 py-3 font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {loading
                  ? "🤖 Generating..."
                  : "🚀 Generate Interview"}
              </button>

            </div>

          </form>
        </div>

        {/* ================= INFO ================= */}

        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-5">
          <div className="flex gap-3">
            <div className="text-xl">💡</div>

            <div>
              <h3 className="font-semibold text-blue-800">
                How it works
              </h3>

              <p className="mt-1 text-sm leading-relaxed text-blue-700">
                Choose your target role, interview type, difficulty,
                and number of questions. Our AI will generate a
                personalized interview based on your selections.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CreateInterview;