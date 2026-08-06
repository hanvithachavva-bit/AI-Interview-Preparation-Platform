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
      statusFilter === "All" ||
      interview.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const response = await api.get("/interviews");

      console.log(response.data);

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
    <div>
      <h1>AI Interview Preparation Platform</h1>

      <h2>
        Welcome, {user ? user.fullName : "User"} 👋
      </h2>

      <button onClick={() => navigate("/create-interview")}>
        Create Interview
      </button>
      <hr />

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
            textAlign: "center",
          }}
        >
          <h3>Total Interviews</h3>
          <h2>{totalInterviews}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
            textAlign: "center",
          }}
        >
          <h3>Completed</h3>
          <h2>{completedInterviews}</h2>
        </div>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            width: "180px",
            textAlign: "center",
          }}
        >
          <h3>In Progress</h3>
          <h2>{inProgressInterviews}</h2>
        </div>
      </div>

      <hr />

      <h3>Your Interviews</h3>
      <input
        type="text"
        placeholder="🔍 Search by role..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          width: "300px",
          padding: "10px",
          marginTop: "10px",
          marginBottom: "20px",
          borderRadius: "8px",
          border: "1px solid #ccc",
        }}
      />
      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        style={{
          marginLeft: "15px",
          padding: "10px",
          borderRadius: "8px",
        }}
      >
        <option value="All">All</option>
        <option value="completed">Completed</option>
        <option value="in-progress">In Progress</option>
      </select>

        {filteredInterviews.length === 0 ? (
          <p>No interviews found.</p>
        ) : (
          filteredInterviews.map((interview) => (
            <div
              key={interview._id}
              style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "15px",
                borderRadius: "8px",
              }}
            >
              <h4>{interview.role}</h4>

              <p>
                <strong>Difficulty:</strong> {interview.difficulty}
              </p>
              <p>
                <strong>Status:</strong> {interview.status}
              </p>

              <p>
                <strong>Created:</strong>{" "}
                {new Date(interview.createdAt).toLocaleDateString()}
              </p>
              

              <div style={{ display: "flex", gap: "10px" }}>
                {interview.status === "completed" ? (
                  <button
                    onClick={() => navigate(`/interview-result/${interview._id}`)}
                  >
                    View Result
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/interview/${interview._id}`)}
                  >
                    Continue Interview
                  </button>
                )}

                <button
                  onClick={() => handleDeleteInterview(interview._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
    </div>
  );
}

export default Dashboard;