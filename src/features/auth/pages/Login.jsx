import { useState } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await API.post("/users/login", form);
      const user = res.data.user;
      const token = res.data.token;

      // Save token & user info
      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);
      localStorage.setItem("isVerified", user.isVerified.toString());

      setMessage("Login successful!");

      // Redirect based on role & verification
      if (user.role === "client") navigate("/client-dashboard");
      else if (user.role === "provider") {
        if (user.isVerified === false) navigate("/pending-approval");
        else navigate("/provider-dashboard");
      } else if (user.role === "admin") navigate("/admin-dashboard");
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed";
      setMessage(msg);

      // If backend returns 403 for unverified provider, redirect
      if (
        error.response?.status === 403 &&
        msg.includes("awaiting admin approval")
      ) {
        navigate("/pending-approval");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-all p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md border dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-medium text-white transition
              ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
              }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          onClick={() => navigate("/forgot-password")}
          className="text-sm text-blue-600 dark:text-blue-400 cursor-pointer mt-2 text-right hover:underline"
        >
          Forgot Password?
        </p>

        {message && (
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
