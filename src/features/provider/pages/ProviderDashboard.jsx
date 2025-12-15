import { useEffect, useState } from "react";
import API from "../../../api/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import AddServiceForm from "../../services/pages/AddServiceForm";
import VerificationUpload from "./VerificationUpload";
import ChatBox from "../../../components/ChatBox";
import { useNavigate } from "react-router-dom";

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("darkMode") === "true"
  );
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

  const TRACKING_STEPS = [
    "Booked",
    "Packing Started",
    "In Transit",
    "Out for Delivery",
    "Delivered",
  ];

  const getNextTrackingStatus = (current) => {
    const index = TRACKING_STEPS.indexOf(current || "Booked");
    if (index === -1 || index === TRACKING_STEPS.length - 1) return null;
    return TRACKING_STEPS[index + 1];
  };

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
      console.log("Dashboard error:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const fetchProviderServices = async () => {
    try {
      const res = await API.get("/services/my-services");
      setServices(res.data);
    } catch (err) {
      console.log(
        "Error fetching services:",
        err.response?.data || err.message
      );
    }
  };

  // Update booking status (Accepted / Rejected)
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}/status`, { status }); // <-- new route
      fetchProviderData(); // refresh dashboard after update
    } catch (err) {
      console.log("Status update error:", err.response?.data || err.message);
    }
  };

  // Update tracking status
  const updateTracking = async (bookingId, nextStatus) => {
    try {
      await API.put("/bookings/update-tracking", {
        bookingId,
        status: nextStatus, // <-- backend expects 'status', not 'nextStatus'
      });
      fetchProviderData(); // refresh dashboard after update
    } catch (err) {
      console.log("Tracking update error:", err.response?.data || err.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center dark:bg-gray-900 dark:text-white">
        <h1 className="text-xl font-semibold">Loading Dashboard...</h1>
      </div>
    );
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex flex-col min-h-screen dark:bg-gray-900 dark:text-white">
        {/* Sticky Header */}
        <header className="bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
              Provider Dashboard
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={logout}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto p-6 space-y-8">
          {/* PROFILE & VERIFICATION */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {provider && (
              <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-xl flex items-center gap-6">
                <img
                  src={provider.profilePic || "/default-profile.png"}
                  alt="Profile"
                  className="w-24 h-24 rounded-full border"
                />
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold">Profile</h2>
                  <p>
                    <strong>Name:</strong> {provider.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {provider.email}
                  </p>
                  <p>
                    <strong>Role:</strong> {provider.role}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 shadow p-5 rounded-xl">
              <h2 className="text-2xl font-bold mb-2">Verification</h2>
              {provider.isVerifiedProvider ? (
                <p className="text-green-500 font-semibold">
                  You are verified ✔
                </p>
              ) : provider.verificationDocs?.length > 0 ? (
                <p className="text-yellow-500 font-semibold">
                  Verification Pending ⏳
                </p>
              ) : (
                <VerificationUpload onUploaded={fetchProviderData} />
              )}
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard title="Total Bookings" value={stats.total} />
            <StatCard title="Pending" value={stats.pending} color="yellow" />
            <StatCard title="Completed" value={stats.completed} color="green" />
            <StatCard
              title="Earnings"
              value={`₹${stats.earnings}`}
              color="blue"
            />
          </div>

          {/* Earnings Chart */}
          <Section title="Earnings Overview">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.earningsHistory}>
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
          </Section>

          {/* SERVICES */}
          <Section title="Manage Services">
            <AddServiceForm onServiceAdded={fetchProviderServices} />
            {services.length === 0 ? (
              <p>No services added yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border p-2">Title</th>
                      <th className="border p-2">Price</th>
                      <th className="border p-2">Locations</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((s) => (
                      <tr key={s._id}>
                        <td className="border p-2">{s.title}</td>
                        <td className="border p-2">₹{s.price}</td>
                        <td className="border p-2">
                          {s.availableLocations.join(", ")}
                        </td>
                        <td className="border p-2 space-x-2">
                          <button
                            onClick={() =>
                              navigate(`/admin/services/edit/${s._id}`)
                            }
                            className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={async () => {
                              if (
                                window.confirm(
                                  "Are you sure you want to delete this service?"
                                )
                              ) {
                                try {
                                  await API.delete(`/services/${s._id}`);
                                  // Optionally refresh the list or remove from state
                                  setServices(
                                    services.filter(
                                      (service) => service._id !== s._id
                                    )
                                  );
                                } catch (error) {
                                  console.error("Delete failed", error);
                                }
                              }
                            }}
                            className="px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* BOOKINGS */}
          <Section title="Booking Requests">
            {stats.bookings.length === 0 ? (
              <p>No bookings yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-center">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                      <th className="border p-2">Client</th>
                      <th className="border p-2">Service</th>
                      <th className="border p-2">Pickup</th>
                      <th className="border p-2">Drop</th>
                      <th className="border p-2">Date</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Tracking</th>
                      <th className="border p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.bookings.map((b) => (
                      <tr key={b._id}>
                        <td className="border p-2">{b.client?.name}</td>
                        <td className="border p-2">{b.service?.title}</td>
                        <td className="border p-2">{b.pickupLocation}</td>
                        <td className="border p-2">{b.dropLocation}</td>
                        <td className="border p-2">
                          {new Date(b.date).toLocaleDateString()}
                        </td>

                        {/* STATUS */}
                        <td className="border p-2">
                          <span
                            className={`px-2 py-1 rounded font-semibold ${
                              b.status === "Pending"
                                ? "bg-yellow-200 text-yellow-800"
                                : b.status === "Accepted"
                                ? "bg-blue-200 text-blue-800"
                                : b.status === "In Progress"
                                ? "bg-purple-200 text-purple-800"
                                : b.status === "Completed"
                                ? "bg-green-200 text-green-800"
                                : "bg-gray-200 text-gray-800"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>

                        {/* TRACKING */}
                        <td className="border p-2">
                          <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm">
                            {b.trackingStatus || "Booked"}
                          </span>
                        </td>

                        {/* ACTIONS */}
                        <td className="border p-2 space-x-2">
                          <button
                            onClick={() => setSelectedBooking(b)}
                            className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Chat
                          </button>

                          {b.status === "Pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(b._id, "Accepted")}
                                className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => updateStatus(b._id, "Cancelled")}
                                className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </>
                          )}

                          {b.status === "Accepted" &&
                            getNextTrackingStatus(b.trackingStatus) && (
                              <button
                                onClick={() =>
                                  updateTracking(
                                    b._id,
                                    getNextTrackingStatus(b.trackingStatus)
                                  )
                                }
                                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                              >
                                Mark {getNextTrackingStatus(b.trackingStatus)}
                              </button>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Section>

          {/* CHAT BOX */}
          {selectedBooking && (
            <ChatBox
              booking={selectedBooking}
              onClose={() => setSelectedBooking(null)}
              currentUser={provider}
            />
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, color = "white" }) => {
  const bgColor =
    color === "yellow"
      ? "bg-yellow-100 dark:bg-yellow-600"
      : color === "green"
      ? "bg-green-100 dark:bg-green-700"
      : color === "blue"
      ? "bg-blue-100 dark:bg-blue-700"
      : "bg-white dark:bg-gray-800";
  const textColor =
    color === "yellow"
      ? "text-gray-700 dark:text-white"
      : color === "green"
      ? "text-gray-700 dark:text-white"
      : color === "blue"
      ? "text-gray-700 dark:text-white"
      : "text-gray-500 dark:text-gray-300";

  return (
    <div className={`${bgColor} shadow rounded-xl p-6 text-center`}>
      <h2 className={`${textColor}`}>{title}</h2>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div className="bg-white dark:bg-gray-800 shadow rounded-xl p-6">
    <h2 className="text-xl font-semibold dark:text-white mb-4">{title}</h2>
    {children}
  </div>
);

export default ProviderDashboard;
