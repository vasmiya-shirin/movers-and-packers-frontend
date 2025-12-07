import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import ReviewForm from "./ReviewForm";

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      setBookings(res.data.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-gray-900 dark:text-white">
        My Bookings
      </h1>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl transition hover:shadow-lg"
            >
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {b.service?.title || "Service"}
              </h2>

              <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`font-semibold ${
                      b.status?.toLowerCase() === "completed"
                        ? "text-green-600 dark:text-green-400"
                        : b.status?.toLowerCase() === "pending"
                        ? "text-yellow-600 dark:text-yellow-400"
                        : "text-blue-600 dark:text-blue-400"
                    }`}
                  >
                    {b.status}
                  </span>
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Provider Info */}
              {b.provider ? (
                <div className="mt-3 text-gray-700 dark:text-gray-300 space-y-1">
                  <p>
                    <strong>Provider Name:</strong> {b.provider.name || "N/A"}
                  </p>
                  <p>
                    <strong>Provider Email:</strong> {b.provider.email || "N/A"}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-gray-500 dark:text-gray-400">
                  Provider info not available
                </p>
              )}

              {/* Review Form (Only for completed bookings) */}
              {b.status?.toLowerCase() === "completed" && b.provider?._id && (
                <div className="mt-4">
                  <ReviewForm
                    bookingId={b._id}
                    providerId={b.provider._id}
                    onSuccess={() => {
                      alert("Review submitted!");
                      fetchBookings();
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Back to Profile Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/client-dashboard")}
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition font-medium"
        >
          Back to Profile
        </button>
      </div>
    </div>
  );
};

export default ClientBookings;

