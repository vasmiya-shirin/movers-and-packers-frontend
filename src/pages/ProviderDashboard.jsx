import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const ProviderDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0,
    bookings: [],
    earningsHistory: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
  }, []);

  const fetchProviderData = async () => {
    try {
      const res = await API.get("/bookings/provider-dashboard");
      setStats(res.data);

      const profile = await API.get("/users/profile");
      setProvider(profile.data);

      setLoading(false);
    } catch (error) {
      console.log("Dashboard error:", error);
      setLoading(false);
    }
  };

  // 📌 Handle booking status update
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      fetchProviderData();
    } catch (err) {
      console.log("Status update error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <h1 className="text-xl font-semibold">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER */}
      <motion.h1
        className="text-3xl font-bold mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Provider Dashboard
      </motion.h1>

      {/* PROFILE */}
      {provider && (
        <motion.div
          className="bg-white shadow p-5 rounded-xl mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-2">Profile</h2>
          <p><strong>Name:</strong> {provider.name}</p>
          <p><strong>Email:</strong> {provider.email}</p>
          <p><strong>Role:</strong> {provider.role}</p>
        </motion.div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div className="p-6 bg-white shadow rounded-xl" whileHover={{ scale: 1.05 }}>
          <h2 className="text-gray-500">Total Bookings</h2>
          <p className="text-3xl font-bold">{stats.total}</p>
        </motion.div>

        <motion.div className="p-6 bg-yellow-100 shadow rounded-xl" whileHover={{ scale: 1.05 }}>
          <h2 className="text-gray-700">Pending</h2>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </motion.div>

        <motion.div className="p-6 bg-green-100 shadow rounded-xl" whileHover={{ scale: 1.05 }}>
          <h2 className="text-gray-700">Completed</h2>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </motion.div>

        <motion.div className="p-6 bg-blue-100 shadow rounded-xl" whileHover={{ scale: 1.05 }}>
          <h2 className="text-gray-700">Earnings</h2>
          <p className="text-3xl font-bold">₹{stats.earnings}</p>
        </motion.div>
      </div>

      {/* EARNINGS CHART */}
      <div className="bg-white mt-10 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Earnings Overview</h2>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.earningsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="earnings" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* BOOKING MANAGEMENT */}
      <motion.div
        className="mt-10 bg-white p-6 rounded-xl shadow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-xl font-bold mb-4">Booking Requests</h2>

        {stats.bookings.length === 0 ? (
          <p>No bookings yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Client</th>
                <th className="border p-2">Pickup</th>
                <th className="border p-2">Drop</th>
                <th className="border p-2">Date</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stats.bookings.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="border p-2">{b.client.name}</td>
                  <td className="border p-2">{b.pickupLocation}</td>
                  <td className="border p-2">{b.dropLocation}</td>
                  <td className="border p-2">
                    {new Date(b.date).toLocaleDateString()}
                  </td>
                  <td className="border p-2 font-semibold">{b.status}</td>

                  {/* ACTION BUTTONS */}
                  <td className="border p-2 space-x-2">
                    {b.status === "Pending" && (
                      <>
                        <button
                          onClick={() => updateStatus(b._id, "Accepted")}
                          className="px-3 py-1 bg-green-600 text-white rounded"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(b._id, "Rejected")}
                          className="px-3 py-1 bg-red-600 text-white rounded"
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {b.status === "Accepted" && (
                      <button
                        onClick={() => updateStatus(b._id, "Completed")}
                        className="px-3 py-1 bg-blue-600 text-white rounded"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>
    </div>
  );
};

export default ProviderDashboard;


