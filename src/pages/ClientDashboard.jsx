import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile
  const fetchProfile = async () => {
    try {
      const res = await API.get("/users/profile");
      setUser(res.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center mt-10 text-lg"
      >
        Loading Dashboard...
      </motion.p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <motion.aside
        initial={{ x: -120, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-64 bg-white shadow-xl p-6"
      >
        <h2 className="text-2xl font-bold mb-6">Client Menu</h2>

        <ul className="space-y-4">

          {/* menu animations */}
          {[
            { name: "Dashboard", path: "/client-dashboard", active: true },
            { name: "View Services", path: "/services" },
            { name: "My Bookings", path: "/my-bookings" },
            { name: "Edit Profile", path: "/edit-profile" },
          ].map((item, index) => (
            <motion.li
              key={index}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate(item.path)}
              className={`p-2 rounded cursor-pointer ${
                item.active ? "bg-blue-600 text-white" : "hover:bg-gray-200"
              }`}
            >
              {item.name}
            </motion.li>
          ))}

          <motion.li
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="p-2 bg-red-500 text-white rounded cursor-pointer"
            onClick={handleLogout}
          >
            Logout
          </motion.li>
        </ul>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Welcome, {user?.name}
        </motion.h1>

        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-3xl"
        >
          <h2 className="text-xl font-bold mb-4">Your Profile</h2>

          <div className="flex gap-6">
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              src={user?.profilePic || "https://via.placeholder.com/120"}
              className="w-28 h-28 rounded-full border shadow-sm"
              alt="Profile"
            />

            <div className="grid grid-cols-2 gap-y-2 w-full">
              <p><strong>Name:</strong> {user?.name}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Phone:</strong> {user?.phone || "Not Added"}</p>
              <p><strong>Address:</strong> {user?.address || "Not Added"}</p>
            </div>
          </div>
        </motion.div>

        {/* Bookings Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mt-10 bg-white p-6 rounded-xl shadow-md"
        >
          <h2 className="text-xl font-bold mb-4">Recent Bookings</h2>

          <p className="text-gray-600">
            No recent bookings. Book a service to see it here.
          </p>
        </motion.div>

      </main>
    </div>
  );
};

export default ClientDashboard;
