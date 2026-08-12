import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);

    navigate("/login");
    setSidebarOpen(false);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      {/* ================= TOP NAVBAR ================= */}

      <nav
        style={{
          display: "flex",
          alignItems: "center",
          padding: "15px 30px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Hamburger Button */}

        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            border: "none",
            background: "transparent",
            fontSize: "26px",
            cursor: "pointer",
            marginRight: "20px",
            padding: "2px 8px",
            color: "#374151",
          }}
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        {/* Logo */}

        <Link
          to="/dashboard"
          onClick={closeSidebar}
          style={{
            textDecoration: "none",
            fontSize: "22px",
            fontWeight: "700",
            color: "#2563eb",
          }}
        >
          AI Interview
        </Link>
      </nav>

      {/* ================= OVERLAY ================= */}

      {sidebarOpen && (
        <div
          onClick={closeSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.35)",
            zIndex: 1100,
          }}
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        style={{
          position: "fixed",
          top: 0,
          left: sidebarOpen ? 0 : "-300px",
          width: "280px",
          height: "100vh",
          backgroundColor: "#ffffff",
          boxShadow: sidebarOpen
            ? "4px 0 15px rgba(0, 0, 0, 0.15)"
            : "none",
          zIndex: 1200,
          transition: "left 0.25s ease",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Sidebar Header */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "18px 20px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <Link
            to="/dashboard"
            onClick={closeSidebar}
            style={{
              textDecoration: "none",
              fontSize: "21px",
              fontWeight: "700",
              color: "#2563eb",
            }}
          >
            🤖 AI Interview
          </Link>

          <button
            onClick={closeSidebar}
            style={{
              border: "none",
              background: "transparent",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
            }}
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Navigation */}

        <div
          style={{
            padding: "20px 15px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
          }}
        >
          {/* Dashboard */}

          <Link
            to="/dashboard"
            onClick={closeSidebar}
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: "500",
              padding: "13px 15px",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            🏠 Dashboard
          </Link>

          {/* Create Interview */}

          <Link
            to="/create-interview"
            onClick={closeSidebar}
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: "500",
              padding: "13px 15px",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            🎯 Create Interview
          </Link>

          {/* My Interviews */}

          <Link
            to="/interviews"
            onClick={closeSidebar}
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: "500",
              padding: "13px 15px",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            📋 My Interviews
          </Link>

          {/* Resume Matcher */}

          <Link
            to="/resume-matcher"
            onClick={closeSidebar}
            style={{
              textDecoration: "none",
              color: "#374151",
              fontWeight: "500",
              padding: "13px 15px",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          >
            📄 Resume Matcher
          </Link>

          {/* Settings - Coming Later */}

          <button
            disabled
            style={{
              textAlign: "left",
              border: "none",
              background: "transparent",
              color: "#9ca3af",
              fontWeight: "500",
              padding: "13px 15px",
              borderRadius: "8px",
              fontSize: "15px",
              cursor: "not-allowed",
            }}
          >
            ⚙️ Settings
            <span
              style={{
                fontSize: "11px",
                marginLeft: "8px",
                color: "#9ca3af",
              }}
            >
              Coming Soon
            </span>
          </button>
        </div>

        {/* Bottom Section */}

        <div
          style={{
            marginTop: "auto",
            padding: "15px",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          {/* Logout */}

          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "12px 15px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              cursor: "pointer",
              fontWeight: "500",
              fontSize: "15px",
              textAlign: "left",
            }}
          >
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Navbar;