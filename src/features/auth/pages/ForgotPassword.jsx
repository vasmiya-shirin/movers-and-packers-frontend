import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [otp, setOtp] = useState(""); // optional, for testing
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/users/forgot-password", { email });

      // Save OTP for testing
      setOtp(res.data.otp);

      setMsg("OTP generated! Navigating to verify OTP...");

      // Navigate to Verify OTP page after 1-2 seconds
      setTimeout(() => {
        navigate("/verify-otp", {
          state: { email, otp: res.data.otp }, // pass email and OTP for testing
        });
      }, 1000);
    } catch (err) {
      setMsg(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 sm:px-6">
      <div className="bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-xl shadow-lg w-full max-w-md transition-colors">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white p-3 rounded-lg font-semibold transition"
          >
            Generate OTP
          </button>
        </form>

        {msg && (
          <p className="text-center mt-4 text-green-600 dark:text-green-400 font-medium">
            {msg}
          </p>
        )}

        {otp && (
          <p className="text-center mt-2 text-gray-700 dark:text-gray-300 font-bold">
            OTP (for testing): {otp}
          </p>
        )}
      </div>
    </div>
  );
}





