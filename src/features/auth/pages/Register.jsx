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
  const [message, setMessage] = useState(""); // Show backend error
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setForm({ ...form, profilePic: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Client-side validation
    if (form.phone && !/^[0-9]{8,15}$/.test(form.phone)) {
      setMessage("Phone number must be 8-15 digits");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(form.email)) {
      setMessage("Please enter a valid email address");
      return;
    }
    if (form.password.length < 6) {
      setMessage("Password must be at least 6 characters");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      Object.keys(form).forEach((key) => formData.append(key, form[key]));

      const res = await API.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage(res.data.message); // Success message
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md w-full max-w-md border dark:border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
          Create Account
        </h2>

        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="file"
            name="profilePic"
            onChange={handleFileChange}
            className="w-full p-2 border rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg text-white ${
              loading ? "bg-gray-400" : "bg-blue-600"
            }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
