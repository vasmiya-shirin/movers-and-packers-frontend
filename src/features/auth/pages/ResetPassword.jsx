import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../../api/api";

export default function ResetPassword() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const resetToken = state?.resetToken;

  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");

  // ✅ FIX — Redirect only inside useEffect()
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
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full border p-3 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />

          <button className="w-full bg-purple-600 text-white p-3 rounded-lg hover:bg-purple-700 transition">
            Reset Password
          </button>
        </form>

        {msg && <p className="text-center mt-4 text-green-600">{msg}</p>}
      </div>
    </div>
  );
}


