import { useState } from "react";
import api from "../services/api";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")

    try {
      const response = await api.post("/auth/register", formData);

      console.log(response.data);
    } catch (error) {
      setError(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={formData.fullName}
        onChange={handleChange}
       />

      <br />
      <br />

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

      <button type="submit">
        Register
      </button>
    </form>
  );
}

export default Register;