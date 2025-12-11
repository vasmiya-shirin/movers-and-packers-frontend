import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../../../api/api";

export default function VerifyOTP() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const email = state?.email;
  const testOtp = state?.otp; // OTP from previous page (for testing)

  const [otp, setOtp] = useState(testOtp || "");
  const [msg, setMsg] = useState("");

  // Redirect if email is missing
  useEffect(() => {
    if (!email) navigate("/forgot-password");
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/verify-otp", { email, otp });

      navigate("/reset-password", {
        state: { resetToken: res.data.resetToken, email },
      });
    } catch (err) {
      setMsg(err.response?.data?.message || "Invalid or expired OTP");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md transition-colors">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white p-3 rounded-lg font-semibold transition"
          >
            Verify
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-red-600 dark:text-red-400 font-medium">
            {msg}
          </p>
        )}

        {testOtp && (
          <p className="text-center mt-2 text-gray-700 dark:text-gray-300 font-bold">
            OTP (for testing): {testOtp}
          </p>
        )}
      </div>
    </div>
  );
}
