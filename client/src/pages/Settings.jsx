import { useEffect, useState } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function Settings() {
  const { setUser } = useAuth();

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    role: "",
  });

  const [profileLoading, setProfileLoading] = useState(true);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const [profileError, setProfileError] = useState("");

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // ================= GET PROFILE =================

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");

        const user = response.data.user;

        setProfile({
          fullName: user.fullName || "",
          email: user.email || "",
          role: user.role || "user",
        });
      } catch (error) {
        console.error("Profile error:", error);

        setProfileError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ================= PROFILE INPUT =================

  const handleProfileChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // ================= UPDATE PROFILE =================

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    setProfileMessage("");
    setProfileError("");

    if (!profile.fullName.trim()) {
      setProfileError("Full name is required.");
      return;
    }

    try {
      setProfileSaving(true);

      const response = await api.put("/auth/profile", {
        fullName: profile.fullName,
      });

      const updatedUser = response.data.user;

      setProfile({
        fullName: updatedUser.fullName,
        email: updatedUser.email,
        role: updatedUser.role,
      });

      // Update stored user information
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      // Update AuthContext
      setUser(updatedUser);

      setProfileMessage(
        "Profile updated successfully."
      );
    } catch (error) {
      console.error("Update profile error:", error);

      setProfileError(
        error.response?.data?.message ||
          "Failed to update profile."
      );
    } finally {
      setProfileSaving(false);
    }
  };

  // ================= PASSWORD INPUT =================

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  // ================= CHANGE PASSWORD =================

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    if (
      !passwordData.currentPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setPasswordError(
        "Please fill in all password fields."
      );
      return;
    }

    if (
      passwordData.newPassword !==
      passwordData.confirmPassword
    ) {
      setPasswordError(
        "New password and confirm password do not match."
      );
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setPasswordError(
        "New password must be at least 6 characters."
      );
      return;
    }

    try {
      setPasswordSaving(true);

      const response = await api.put(
        "/auth/change-password",
        {
          currentPassword:
            passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }
      );

      setPasswordMessage(
        response.data.message ||
          "Password changed successfully."
      );

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Change password error:", error);

      setPasswordError(
        error.response?.data?.message ||
          "Failed to change password."
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  // ================= LOADING =================

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-gray-500 text-lg">
              Loading settings...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account and password.
          </p>
        </div>

        {/* ================= PROFILE SETTINGS ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 mb-6">

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Account Information
          </h2>

          <p className="text-gray-500 mb-6">
            Update your personal information.
          </p>

          {profileMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-5">
              {profileMessage}
            </div>
          )}

          {profileError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5">
              {profileError}
            </div>
          )}

          <form onSubmit={handleProfileSubmit}>

            {/* Full Name */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="fullName"
                value={profile.fullName}
                onChange={handleProfileChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* Email */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-lg px-4 py-3 cursor-not-allowed"
              />

              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed.
              </p>
            </div>

            {/* Account Type */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Type
              </label>

              <span className="inline-block bg-blue-50 text-blue-600 px-3 py-2 rounded-full text-sm font-medium capitalize">
                {profile.role}
              </span>
            </div>

            <button
              type="submit"
              disabled={profileSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {profileSaving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </form>
        </div>

        {/* ================= PASSWORD SETTINGS ================= */}

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">

          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Change Password
          </h2>

          <p className="text-gray-500 mb-6">
            Update your account password.
          </p>

          {passwordMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg p-3 mb-5">
              {passwordMessage}
            </div>
          )}

          {passwordError && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-5">
              {passwordError}
            </div>
          )}

          <form onSubmit={handlePasswordSubmit}>

            {/* Current Password */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            {/* New Password */}

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

              <p className="text-xs text-gray-400 mt-1">
                Password must be at least 6 characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              disabled={passwordSaving}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white px-6 py-3 rounded-lg font-semibold"
            >
              {passwordSaving
                ? "Changing..."
                : "Change Password"}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;