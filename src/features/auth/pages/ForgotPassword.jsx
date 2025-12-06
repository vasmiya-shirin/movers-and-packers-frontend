import { useState } from "react";
import API from "../../../api/api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await API.post("/users/forgot-password", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-all">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96 border dark:border-gray-700">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Forgot Password
        </h2>

        <form onSubmit={submitEmail}>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded hover:bg-blue-700 dark:hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;
