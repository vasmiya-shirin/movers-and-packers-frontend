import { useEffect, useState } from "react";
import API from "../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [earningsHistory, setEarningsHistory] = useState([]);
  const [recentBookings, setRecentBookings] = useState([]);
  const [allBookings, setAllBookings] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);

  const fetchData = async () => {
    try {
      // Dashboard stats
      const res = await API.get("/bookings/admin-dashboard");
      setStats(res.data.stats);
      setEarningsHistory(res.data.earningsHistory || []);
      setRecentBookings(res.data.recentBookings || []);

      // All bookings
      const allRes = await API.get("/bookings/all");
      setAllBookings(allRes.data.bookings || []);

      // All services
      const servicesRes = await API.get("/services");
      setAllServices(servicesRes.data || []);

      // All reviews (Admin)
      const reviewsRes = await API.get("/reviews");
      setReviews(reviewsRes.data.reviews || []);

      // Pending providers
      const pendingRes = await API.get("/admin/providers/pending");
      setPendingProviders(pendingRes.data.pendingProviders || []);
    } catch (err) {
      console.log("Admin Dashboard Error:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Update Booking Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      fetchData();
    } catch (err) {
      console.log("Update Status Error:", err);
    }
  };
  const approveProvider = async (id) => {
    try {
      await API.put(`/admin/providers/verify/${id}`, { isVerified: true });
      alert("Provider approved successfully!");
      fetchData();
    } catch (err) {
      console.log("Approve Provider Error:", err);
    }
  };

  const rejectProvider = async (id) => {
    if (!window.confirm("Are you sure you want to reject this provider?")) return;
    try {
      await API.delete(`/admin/providers/${id}`);
      alert("Provider rejected!");
      fetchData();
    } catch (err) {
      console.log("Reject Provider Error:", err);
    }
  };

  // Delete Service
  const deleteService = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await API.delete(`/services/${id}`);
      alert("Service deleted successfully");
      fetchData();
    } catch (err) {
      console.log("Delete Service Error:", err);
      alert("Failed to delete service");
    }
  };

  // Logout
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (!stats) return <p className="p-10">Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* HEADER + LOGOUT */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logout}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card title="Total Users" value={stats.totalUsers} />
        <Card title="Providers" value={stats.totalProviders} />
        <Card title="Clients" value={stats.totalClients} />
        <Card title="Services" value={stats.totalServices} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <Card title="Total Bookings" value={stats.totalBookings} />
        <Card title="Completed" value={stats.completed} />
        <Card title="Pending" value={stats.pending} />
        <Card title="Cancelled" value={stats.cancelled} />
      </div>

      {/* Pending Providers */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Pending Providers</h2>
        {pendingProviders.length === 0 ? (
          <p>No pending providers.</p>
        ) : (
          <table className="w-full border-collapse text-center">
            <thead>
              <tr className="bg-gray-200 border-b">
                <th className="border p-2">Name</th>
                <th className="border p-2">Email</th>
                <th className="border p-2">Phone</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingProviders.map((p) => (
                <tr key={p._id} className="border-b">
                  <td className="p-2">{p.name}</td>
                  <td className="p-2">{p.email}</td>
                  <td className="p-2">{p.phone}</td>
                  <td className="p-2 space-x-2">
                    <button
                      onClick={() => approveProvider(p._id)}
                      className="px-2 py-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => rejectProvider(p._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Earnings Chart */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Earnings Overview</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={earningsHistory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#2563eb"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
        {recentBookings.length === 0 ? (
          <p>No recent bookings.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="text-left border-b">
                <th className="p-2">Client</th>
                <th className="p-2">Provider</th>
                <th className="p-2">Service</th>
                <th className="p-2">Status</th>
                <th className="p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map((b) => (
                <tr key={b._id} className="border-b">
                  <td className="p-2">{b.client?.name}</td>
                  <td className="p-2">{b.provider?.name}</td>
                  <td className="p-2">{b.service?.title}</td>
                  <td className="p-2 text-blue-600">{b.status}</td>
                  <td className="p-2">
                    {new Date(b.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Bookings */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">Manage All Bookings</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">Client</th>
              <th className="p-2">Provider</th>
              <th className="p-2">Service</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allBookings.map((b) => (
              <tr key={b._id} className="border-b text-center">
                <td className="p-2">{b.client?.name}</td>
                <td className="p-2">{b.provider?.name}</td>
                <td className="p-2">{b.service?.title}</td>
                <td className="p-2 font-semibold">{b.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => updateStatus(b._id, "Accepted")}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "Completed")}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => updateStatus(b._id, "Cancelled")}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Services */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">All Services</h2>
        {allServices.length === 0 ? (
          <p>No services available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Title</th>
                <th className="border p-2">Provider</th>
                <th className="border p-2">Price</th>
                <th className="border p-2">Locations</th>
                <th className="border p-2">Status</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {allServices.map((s) => (
                <tr key={s._id} className="text-center border-b">
                  <td className="border p-2">{s.title}</td>
                  <td className="border p-2">{s.provider?.name}</td>
                  <td className="border p-2">₹{s.price}</td>
                  <td className="border p-2">
                    {s.availableLocations.join(", ")}
                  </td>
                  <td className="border p-2">{s.isActive ? "Active" : "Inactive"}</td>
                  <td className="border p-2 space-x-2">
                    <button className="px-2 py-1 bg-yellow-500 text-white rounded">
                      Edit
                    </button>
                    <button
                      onClick={() => deleteService(s._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* All Reviews */}
      <div className="bg-white shadow rounded-xl p-6 mb-10">
        <h2 className="text-xl font-semibold mb-4">All Reviews</h2>
        {reviews.length === 0 ? (
          <p>No reviews submitted yet.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left border-b">
                <th className="border p-2">Client</th>
                <th className="border p-2">Provider</th>
                <th className="border p-2">Booking ID</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Comment</th>
                <th className="border p-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((r) => (
                <tr key={r._id} className="border-b">
                  <td className="p-2">{r.client?.name}</td>
                  <td className="p-2">{r.provider?.name}</td>
                  <td className="p-2">{r.booking}</td>
                  <td className="p-2">{r.rating} ⭐</td>
                  <td className="p-2">{r.comment}</td>
                  <td className="p-2">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// Simple Card component
const Card = ({ title, value }) => (
  <div className="bg-white shadow p-6 rounded-xl">
    <p className="text-gray-500">{title}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
  </div>
);

export default AdminDashboard;

