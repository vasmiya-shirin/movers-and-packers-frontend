import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../../api/api";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const resetToken = state?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  // Redirect if resetToken is missing
  useEffect(() => {
    if (!resetToken) {
      navigate("/forgot-password");
    }
  }, [resetToken, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/reset-password", {
        resetToken,
        newPassword,
      });

      setMsg("Password updated successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMsg(err.response?.data?.message || "Error resetting password");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md transition-colors">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 text-white p-3 rounded-lg font-medium transition"
          >
            Reset Password
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-green-600 dark:text-green-400 font-medium">
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}


