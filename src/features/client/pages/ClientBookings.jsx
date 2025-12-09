import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import ReviewForm from "../../client/pages/ReviewForm";

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      // Filter out deleted services
      const validBookings = (res.data.bookings || []).filter(b => b.service !== null);
      setBookings(validBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  return (
    <div className="p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-gray-100">
        My Bookings
      </h1>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div key={b._id} className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {b.service?.title || "Service"}
              </h2>

              <p className="text-gray-700 dark:text-gray-300 mt-2">
                <strong>Status:</strong>{" "}
                <span className="text-blue-600 dark:text-blue-400">{b.status}</span>
              </p>

              <p className="text-gray-700 dark:text-gray-300 mt-1">
                <strong>Payment:</strong>{" "}
                <span className="text-green-600 dark:text-green-400">{b.paymentStatus}</span>
              </p>

              {b.provider ? (
                <div className="text-gray-700 dark:text-gray-300 mt-1">
                  <p><strong>Provider Name:</strong> {b.provider.name || "N/A"}</p>
                  <p><strong>Provider Email:</strong> {b.provider.email || "N/A"}</p>
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 mt-1">Provider info not available</p>
              )}

              {/* Show ReviewForm ONLY if Completed & Paid */}
              {b.status === "Completed" && b.paymentStatus === "Paid" && b.provider?._id && (
                <ReviewForm
                  bookingId={b._id}
                  providerId={b.provider._id}
                  onSuccess={() => {
                    alert("Review submitted!");
                    fetchBookings();
                  }}
                />
              )}
            </div>
          ))
        )}
      </div>

      <button
        onClick={() => navigate("/client-dashboard")}
        className="mt-6 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default ClientBookings;





