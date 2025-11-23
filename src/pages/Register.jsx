import { useState } from "react";
import API from "../api/api"; // your API instance
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
   
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

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
    Object.keys(form).forEach((key) => {
      formData.append(key, form[key]);
    });

    const res = await API.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    setMessage("Registration Successful!");
    
     setTimeout(() => {
      navigate("/login");
    }, 1000); // optional delay


  } catch (error) {
    setMessage(error.response?.data?.message || "Registration Failed");
  }
};


  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Full Name"
            className="w-full p-3 border rounded mb-3" onChange={handleChange} required />

          <input type="email" name="email" placeholder="Email"
            className="w-full p-3 border rounded mb-3" onChange={handleChange} required />

          <input type="password" name="password" placeholder="Password"
            className="w-full p-3 border rounded mb-3" onChange={handleChange} required />

          <input type="text" name="phone" placeholder="Phone"
            className="w-full p-3 border rounded mb-3" onChange={handleChange} />

          <select name="role" className="w-full p-3 border rounded mb-3" onChange={handleChange}>
            <option value="client">Client</option>
            <option value="provider">Service Provider</option>
          </select>

          <input type="text" name="address" placeholder="Address"
            className="w-full p-3 border rounded mb-3" onChange={handleChange} />

          <input type="file" name="profilePic"
            className="w-full p-3 border rounded mb-3" onChange={handleFileChange} />

          <button type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700">
            Register
          </button>
        </form>

        {message && <p className="text-center mt-4 text-gray-600">{message}</p>}

        <p className="text-center text-sm mt-4">
          Already have an account? <a href="/login" className="text-blue-600 font-bold">Login</a>
        </p>
      </div>
    </div>
  );
};

export default Register;


