import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import ChatBox from "../components/ChatBox";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ NEW: For chat with provider
  const [selectedBooking, setSelectedBooking] = useState(null);

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
    return <p className="text-center mt-10 text-lg">Loading Dashboard...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6 border-r border-gray-200">
        <h2 className="text-2xl font-semibold mb-8">Client Menu</h2>

        <ul className="space-y-3">
          <li
            className="p-3 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition"
            onClick={() => navigate("/client-dashboard")}
          >
            Dashboard
          </li>

          <li
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate("/services")}
          >
            View Services
          </li>

          <li
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </li>

          <li
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </li>

          <li
            className="p-3 bg-red-500 text-white font-medium rounded-lg cursor-pointer hover:bg-red-600 transition"
            onClick={handleLogout}
          >
            Logout
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-10">
          Welcome, {user?.name}
        </h1>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

          <div className="flex items-center gap-6">
            <img
              src={user?.profilePic || "https://via.placeholder.com/120"}
              className="w-28 h-28 rounded-full border shadow-sm object-cover"
              alt="Profile"
            />

            <div className="grid grid-cols-2 gap-y-2 text-gray-800">
              <p><span className="font-medium">Name:</span> {user?.name}</p>
              <p><span className="font-medium">Email:</span> {user?.email}</p>
              <p><span className="font-medium">Phone:</span> {user?.phone || "Not Added"}</p>
              <p><span className="font-medium">Address:</span> {user?.address || "Not Added"}</p>
            </div>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="mt-10 bg-white p-6 rounded-xl shadow-sm border border-gray-200 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>

          <p className="text-gray-600">
            No recent bookings. Book a service to see details here.
          </p>

          {/* ⭐ CHAT BOX */}
          {selectedBooking && (
            <ChatBox booking={selectedBooking} />
          )}
        </div>
      </main>

    </div>
  );
};

export default ClientDashboard;

