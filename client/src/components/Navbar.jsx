import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "15px 30px",
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e5e7eb",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <Link
        to="/dashboard"
        style={{
          textDecoration: "none",
          fontSize: "22px",
          fontWeight: "700",
          color: "#2563eb",
        }}
      >
        AI Interview
      </Link>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "25px",
        }}
      >
        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "500",
          }}
        >
          Dashboard
        </Link>

        <Link
          to="/create-interview"
          style={{
            textDecoration: "none",
            color: "#374151",
            fontWeight: "500",
          }}
        >
          Create Interview
        </Link>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#ef4444",
            color: "white",
            cursor: "pointer",
            fontWeight: "500",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;