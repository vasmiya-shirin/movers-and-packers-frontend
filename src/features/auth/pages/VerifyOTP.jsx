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
    <div className="flex justify-center items-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Verify OTP</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            maxLength="6"
            placeholder="Enter OTP"
            className="w-full border p-3 rounded-lg mb-4"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700"
          >
            Verify
          </button>
        </form>

        {msg && <p className="text-center mt-4 text-red-600">{msg}</p>}

        {testOtp && (
          <p className="text-center mt-2 text-gray-700">
            OTP (for testing): {testOtp}
          </p>
        )}
      </div>
    </div>
  );
}


