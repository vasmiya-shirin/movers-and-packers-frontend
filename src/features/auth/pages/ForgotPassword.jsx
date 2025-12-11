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
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-3 rounded-lg mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Generate OTP
          </button>
        </form>

        {msg && <p className="text-center mt-4 text-green-600">{msg}</p>}

        {otp && (
          <p className="text-center mt-2 text-gray-700 font-bold">
            OTP (for testing): {otp}
          </p>
        )}
      </div>
    </div>
  );
}





