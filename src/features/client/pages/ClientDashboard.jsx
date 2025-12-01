import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import ChatBox from "../../../components/ChatBox";

const ClientDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);
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

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      let bookingsArray = Array.isArray(res.data)
        ? res.data
        : res.data.bookings || [res.data];

      const sorted = bookingsArray
        .sort(
          (a, b) =>
            new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
        )
        .slice(0, 3);

      setBookings(sorted);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchBookings();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) {
    return (
      <p className="text-center mt-10 text-lg dark:text-gray-200">
        Loading Dashboard...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex relative">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 border-r border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-8 dark:text-white">
          Client Menu
        </h2>
        <ul className="space-y-3">
          <li
            className="p-3 bg-blue-600 text-white font-medium rounded-lg cursor-pointer hover:bg-blue-700 transition"
            onClick={() => navigate("/client-dashboard")}
          >
            Dashboard
          </li>
          <li
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition dark:text-gray-200"
            onClick={() => navigate("/services")}
          >
            View Services
          </li>
          <li
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition dark:text-gray-200"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </li>
          <li
            className="p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition dark:text-gray-200"
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
        <h1 className="text-3xl font-semibold mb-10 dark:text-white">
          Welcome, {user?.name}
        </h1>

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Your Profile
          </h2>
          <div className="flex items-center gap-6">
            <img
              src={user?.profilePic || "https://via.placeholder.com/120"}
              className="w-28 h-28 rounded-full border shadow-sm object-cover"
              alt="Profile"
            />
            <div className="grid grid-cols-2 gap-y-2 text-gray-800 dark:text-gray-300">
              <p>
                <span className="font-medium">Name:</span> {user?.name}
              </p>
              <p>
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-medium">Phone:</span>{" "}
                {user?.phone || "Not Added"}
              </p>
              <p>
                <span className="font-medium">Address:</span>{" "}
                {user?.address || "Not Added"}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Bookings Section */}
        <div className="mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-3xl">
          <h2 className="text-xl font-semibold mb-4 dark:text-white">
            Recent Bookings
          </h2>

          {bookings.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400">
              No recent bookings. Book a service to see details here.
            </p>
          ) : (
            <ul className="space-y-3">
              {bookings.map((booking) => (
                <li
                  key={booking._id}
                  className="p-3 rounded-lg bg-gray-100 dark:bg-gray-700 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <p>
                    <span className="font-medium">Service:</span>{" "}
                    {booking.service?.title || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Provider:</span>{" "}
                    {booking.provider?.name || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(
                      booking.date || booking.createdAt
                    ).toLocaleString()}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>{" "}
                    <span
                      className={
                        booking.status === "pending"
                          ? "text-yellow-500"
                          : booking.status === "completed"
                          ? "text-green-500"
                          : "text-gray-500"
                      }
                    >
                      {booking.status || "N/A"}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            <button
              onClick={() => navigate("/my-bookings")}
              className="underline hover:text-blue-600"
            >
              View all bookings
            </button>
          </p>
        </div>
      </main>

      {/* ChatBox Sidebar */}
      {selectedBooking && (
        <ChatBox
          booking={selectedBooking}
          onClose={() => setSelectedBooking(null)}
          currentUser={user} // pass logged-in client
        />
      )}
    </div>
  );
};

export default ClientDashboard;
