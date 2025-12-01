import { useState } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/users/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      setMessage("Login successful!");

      if (res.data.role === "client") navigate("/client-dashboard");
      else if (res.data.role === "provider") navigate("/provider-dashboard");
      else if (res.data.role === "admin") navigate("/admin-dashboard");
    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-all">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96 border dark:border-gray-700">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            className="w-full bg-green-600 dark:bg-green-700 text-white py-3 rounded hover:bg-green-700 dark:hover:bg-green-800 transition"
          >
            Login
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          Don’t have an account?{" "}
          <a
            href="/register"
            className="text-blue-600 dark:text-blue-400 font-bold"
          >
            Register
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;

