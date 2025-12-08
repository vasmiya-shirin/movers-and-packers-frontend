import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../../../api/api";
import ReviewForm from "./ReviewForm";

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch bookings from backend
  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      // Filter out deleted services
      const filtered = res.data.bookings.filter(
        (b) => b.service && b.service.isActive
      );
      setBookings(filtered || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Refetch after successful payment
  useEffect(() => {
    if (location.state?.paymentSuccess) {
      fetchBookings();
    }
  }, [location.state]);

  const handlePayment = async (bookingId) => {
    try {
      setLoading(true);
      const res = await API.post("/payments/create-checkout-session", {
        bookingId,
      });
      window.location.href = res.data.url;
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

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
                {b.service?.title}
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
                  <strong>Total Price:</strong> ₹{b.totalPrice}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(b.createdAt).toLocaleDateString()}
                </p>
              </div>

              {b.provider ? (
                <div className="mt-3 text-gray-700 dark:text-gray-300 space-y-1">
                  <p>
                    <strong>Provider Name:</strong> {b.provider.name}
                  </p>
                  <p>
                    <strong>Provider Email:</strong> {b.provider.email}
                  </p>
                </div>
              ) : (
                <p className="mt-3 text-gray-500 dark:text-gray-400">
                  Provider info not available
                </p>
              )}

              <div className="mt-4">
                {/* Show Pay Now only if booking is Completed & payment is Unpaid */}
                {b.status?.toLowerCase() === "completed" &&
                  b.paymentStatus?.toLowerCase() === "unpaid" && (
                    <button
                      onClick={() => handlePayment(b._id)}
                      disabled={loading}
                      className={`bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-lg shadow transition font-medium ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      {loading ? "Processing..." : "Pay Now"}
                    </button>
                  )}

                {/* Paid label */}
                {b.paymentStatus?.toLowerCase() === "paid" && (
                  <span className="text-green-600 dark:text-green-400 font-semibold text-lg">
                    ✔ Paid
                  </span>
                )}
              </div>

              {/* ReviewForm – show only if paid */}
              {b.status?.toLowerCase() === "completed" &&
                b.paymentStatus?.toLowerCase() === "paid" &&
                b.provider?._id && (
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


