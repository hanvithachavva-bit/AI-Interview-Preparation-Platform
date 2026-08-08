import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const { setUser } = useAuth();
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", formData);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      setUser(response.data.user);
      console.log(response.data);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Login failed. Please check your email and password."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <br />
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

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />

      <br />
      <br />

      <button type="submit">Login</button>

      <p>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={() => navigate("/register")}
          style={{
            border: "none",
            background: "none",
            color: "#2563eb",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          Register
        </button>
      </p>
    </form>
  );
}

export default Login;