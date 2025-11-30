import { useEffect, useState } from "react";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import AddServiceForm from "../components/AddServiceForm";
import VerificationUpload from "./VerificationUpload";
import AvailabilityForm from "./AvailabilityForm";
import ChatBox from "../components/ChatBox";

const ProviderDashboard = () => {
  const [provider, setProvider] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null); // ✅ FIX ADDED
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    earnings: 0,
    bookings: [],
    earningsHistory: [],
  });
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProviderData();
    fetchProviderServices();
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

  const fetchProviderServices = async () => {
    try {
      const res = await API.get("/services/my-services");
      setServices(res.data);
    } catch (err) {
      console.log("Error fetching services:", err);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      fetchProviderData();
    } catch (err) {
      console.log("Status update error:", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Provider Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* PROFILE */}
      {provider && (
        <div className="bg-white shadow p-5 rounded-xl mb-6 flex items-center gap-6">
          <img
            src={provider.profilePic || "/default-profile.png"}
            alt="Profile"
            className="w-24 h-24 rounded-full border"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">Profile</h2>
            <p><strong>Name:</strong> {provider.name}</p>
            <p><strong>Email:</strong> {provider.email}</p>
            <p><strong>Role:</strong> {provider.role}</p>
          </div>
        </div>
      )}

      {/* VERIFICATION */}
      <div className="bg-white shadow p-6 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-4">Verification Documents</h2>
        {provider.isVerifiedProvider ? (
          <p className="text-green-600 font-semibold">You are verified ✔</p>
        ) : provider.verificationDocs?.length > 0 ? (
          <p className="text-yellow-600 font-semibold">
            Documents uploaded — Verification Pending ⏳
          </p>
        ) : (
          <VerificationUpload onUploaded={fetchProviderData} />
        )}
      </div>

      {/* AVAILABILITY */}
      <div className="bg-white shadow p-6 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-4">Set Availability</h2>
        <AvailabilityForm provider={provider} onUpdated={fetchProviderData} />
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <h2 className="text-gray-500">Total Bookings</h2>
          <p className="text-3xl font-bold">{stats.total}</p>
        </div>

        <div className="p-6 bg-yellow-100 shadow rounded-xl">
          <h2 className="text-gray-700">Pending</h2>
          <p className="text-3xl font-bold">{stats.pending}</p>
        </div>

        <div className="p-6 bg-green-100 shadow rounded-xl">
          <h2 className="text-gray-700">Completed</h2>
          <p className="text-3xl font-bold">{stats.completed}</p>
        </div>

        <div className="p-6 bg-blue-100 shadow rounded-xl">
          <h2 className="text-gray-700">Earnings</h2>
          <p className="text-3xl font-bold">₹{stats.earnings}</p>
        </div>
      </div>

      {/* CHART */}
      <div className="bg-white mt-10 p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Earnings Overview</h2>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.earningsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="amount" stroke="#2563eb" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* SERVICES */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-bold mb-4">Manage Services</h2>

        <AddServiceForm onServiceAdded={fetchProviderServices} />

        {services.length === 0 ? (
          <p>No services added yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Locations</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="text-center">
                  <td className="border p-2">{s.title}</td>
                  <td className="border p-2">₹{s.price}</td>
                  <td className="border p-2">
                    {s.availableLocations.join(", ")}
                  </td>
                  <td className="border p-2 space-x-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded">Edit</button>
                    <button className="px-2 py-1 bg-red-600 text-white rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* BOOKINGS */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow">
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
                  <td className="border p-2">{b.status}</td>

                  <td className="border p-2 space-x-2">
                    {/* Chat */}
                    <button
                      onClick={() => setSelectedBooking(b)} // ✅ OPEN CHAT
                      className="px-3 py-1 bg-indigo-600 text-white rounded"
                    >
                      Chat
                    </button>

                    {/* Status buttons */}
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
      </div>

      {/* CHAT BOX (open only when booking selected) */}
      {selectedBooking && (
        <ChatBox booking={selectedBooking} onClose={() => setSelectedBooking(null)} />
      )}
    </div>
  );
};

export default ProviderDashboard;
