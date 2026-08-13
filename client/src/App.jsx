import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateInterview from "./pages/CreateInterview";
import Interview from "./pages/Interview";
import InterviewResult from "./pages/InterviewResult";
import ResumeMatcher from "./pages/ResumeMatcher";
import Performance from "./pages/Performance";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Interviews from "./pages/Interviews";
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}

        <Route path="/" element={<Login />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* ================= PROTECTED ROUTES ================= */}

        {/* Dashboard */}
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
        {/* Performance */}
        <Route
          path="/performance"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Performance />
              </>
            </ProtectedRoute>
          }
        />


        {/* Create Interview */}
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


        {/* Interview */}
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


        {/* Interview Result */}
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
        {/* Resume Matcher */}
        <Route
          path="/resume-matcher"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <ResumeMatcher />
              </>
            </ProtectedRoute>
          }
        />

        {/* My Interviews */}
        <Route
          path="/interviews"
          element={
            <ProtectedRoute>
              <>
                <Navbar />
                <Interviews />
              </>
            </ProtectedRoute>
          }
       />    
      </Routes>
    </BrowserRouter>
  );
}

export default App;