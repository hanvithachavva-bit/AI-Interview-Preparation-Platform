import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
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