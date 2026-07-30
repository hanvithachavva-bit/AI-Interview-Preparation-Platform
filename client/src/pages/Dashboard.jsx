import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

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

      <p>No interviews found.</p>
    </div>
  );
}

export default Dashboard;