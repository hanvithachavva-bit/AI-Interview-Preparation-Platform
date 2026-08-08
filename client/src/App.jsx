import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import Interview from "./pages/Interview";
import InterviewResult from "./pages/InterviewResult";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Dashboard />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-interview"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <CreateInterview />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Interview />
              </>
            </ProtectedRoute>
          }
        />

        <Route
          path="/interview-result/:id"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <InterviewResult />
              </>
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;