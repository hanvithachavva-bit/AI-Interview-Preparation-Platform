import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function CreateInterview() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    role: "",
    difficulty: "Easy",
    numberOfQuestions: 5,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/interviews", formData);

      console.log(response.data);

      navigate(`/interview/${response.data.interview._id}`);
    } catch (error) {
      console.error(error);

      setError(
        error.response?.data?.message ||
        "Failed to generate interview. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Create Interview</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Role</label>
          <br />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Frontend Developer"
          />
        </div>

        <br />

        <div>
          <label>Difficulty</label>
          <br />
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </select>
        </div>

        <br />

        <div>
          <label>Number of Questions</label>
          <br />
          <input
            type="number"
            name="numberOfQuestions"
            value={formData.numberOfQuestions}
            onChange={handleChange}
            min="1"
            max="20"
          />
        </div>

        <br />
        {error && (
          <p
            style={{
              color: "red",
              fontWeight: "500",
           }}
          >
            {error}
          </p>
       )}

        <button
          type="submit"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Interview"}
        </button>
      </form>
    </div>
  );
}

export default CreateInterview;