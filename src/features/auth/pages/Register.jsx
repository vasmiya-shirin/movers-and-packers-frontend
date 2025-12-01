import { useState } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "client",
    address: "",
    profilePic: null,
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      await API.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Registration Successful!");

      setTimeout(() => navigate("/login"), 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 transition-all">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-96 border dark:border-gray-700 transition">
        
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create Account
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleChange}
            required
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleChange}
          />

          <select
            name="role"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleChange}
          >
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>

          <input
            type="text"
            name="address"
            placeholder="Address"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleChange}
          />

          <input
            type="file"
            name="profilePic"
            className="w-full p-3 border rounded mb-3 bg-gray-50 dark:bg-gray-700 
              dark:border-gray-600 dark:text-white"
            onChange={handleFileChange}
          />

          <button
            type="submit"
            className="w-full bg-blue-600 dark:bg-blue-700 text-white py-3 rounded 
              hover:bg-blue-700 dark:hover:bg-blue-800 transition"
          >
            Register
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-gray-700 dark:text-gray-300">
            {message}
          </p>
        )}

        <p className="text-center text-sm mt-4 text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 dark:text-blue-400 font-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
