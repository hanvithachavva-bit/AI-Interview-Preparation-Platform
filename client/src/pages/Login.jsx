import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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

    try {
      const response = await api.post("/auth/login", formData);

      // Save JWT token
      localStorage.setItem("token", response.data.token);

      // Save logged-in user in AuthContext
      setUser(response.data.user);
      

      console.log(response.data);
      navigate("/dashboard");
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <br />
      <br />

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
    </form>
  );
}

export default Login;