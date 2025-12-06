import { useState } from "react";
import API from "../../../api/api";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const resetPass = async (e) => {
    e.preventDefault();

    if (password !== confirmPass) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post(`/users/reset-password/${token}`, {
        password,
      });
      setMessage("Password reset successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Invalid or expired token");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-all">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96 border dark:border-gray-700">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Reset Password
        </h2>

        <form onSubmit={resetPass}>
          <input
            type="password"
            placeholder="New Password"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={(e) => setConfirmPass(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded hover:bg-green-700 dark:hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
