import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/auth/profile");

      setUser(response.data.user);
    } catch (error) {
      console.error("Profile error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500 text-lg">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= ERROR =================

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-red-200 rounded-xl p-8 text-center mt-8">
            <div className="text-4xl mb-4">⚠️</div>

            <h2 className="text-xl font-bold text-gray-800 mb-2">
              Unable to load profile
            </h2>

            <p className="text-red-500 mb-5">
              {error}
            </p>

            <button
              onClick={fetchProfile}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Profile
          </h1>

          <p className="text-gray-500 mt-2">
            View your account information.
          </p>
        </div>

        {/* ================= PROFILE CARD ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

          {/* Avatar */}

          <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-200">
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                {user?.fullName || "User"}
              </h2>

              <p className="text-gray-500">
                {user?.email}
              </p>
            </div>
          </div>

          {/* ================= ACCOUNT INFORMATION ================= */}

          <h3 className="text-xl font-bold text-gray-900 mb-5">
            Account Information
          </h3>

          <div className="space-y-5">

            {/* Full Name */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Full Name
              </p>

              <p className="text-lg font-medium text-gray-900">
                {user?.fullName || "Not available"}
              </p>
            </div>

            {/* Email */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Email
              </p>

              <p className="text-lg font-medium text-gray-900">
                {user?.email || "Not available"}
              </p>
            </div>

            {/* Role */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Account Type
              </p>

              <span className="inline-block bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm font-medium capitalize">
                {user?.role || "user"}
              </span>
            </div>

            {/* Account Created */}

            <div>
              <p className="text-sm text-gray-500 mb-1">
                Account Created
              </p>

              <p className="text-lg font-medium text-gray-900">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : "Not available"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;