import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const totalInterviews = interviews.length;

  const completedInterviews = interviews.filter(
    (interview) => interview.status === "completed"
  ).length;

  const inProgressInterviews = interviews.filter(
    (interview) => interview.status === "in-progress"
  ).length;
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

        {interviews.length === 0 ? (
          <p>No interviews found.</p>
        ) : (
          interviews.map((interview) => (
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
            </div>
          ))
        )}
    </div>
  );
}

export default Dashboard;