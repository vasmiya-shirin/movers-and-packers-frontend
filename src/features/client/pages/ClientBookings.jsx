import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import ReviewForm from "../../client/pages/ReviewForm";

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingPaymentId, setLoadingPaymentId] = useState(null);
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      const validBookings = (res.data.bookings || []).filter(
        (b) => b.service !== null
      );
      setBookings(validBookings);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setBookings([]);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handlePayNow = async (bookingId, serviceTitle, amount) => {
    try {
      setLoadingPaymentId(bookingId);

      const res = await API.post("/payments/create-checkout-session", {
        bookingId,
        serviceName: serviceTitle,
        amount,
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error("Stripe checkout error:", err);
      alert("Failed to initiate payment. Please try again.");
    } finally {
      setLoadingPaymentId(null);
    }
  };

  return (
    <div className="p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4 sm:mb-0">
          My Bookings
        </h1>
        <button
          onClick={() => navigate("/client-dashboard")}
          className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition w-full sm:w-auto"
        >
          Back to Profile
        </button>
      </div>

      <div className="space-y-6">
        {bookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">No bookings found.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 shadow-sm rounded-xl"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {b.service?.title || "Service"}
              </h2>

              <div className="mt-2 text-gray-700 dark:text-gray-300 space-y-1">
                <p>
                  <strong>Status:</strong>{" "}
                  <span className="text-blue-600 dark:text-blue-400">{b.status}</span>
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  <span className="text-green-600 dark:text-green-400">{b.paymentStatus}</span>
                </p>
                <p>
                  <strong>Pickup Location:</strong> {b.pickupLocation || "N/A"}
                </p>
                <p>
                  <strong>Drop Location:</strong> {b.dropLocation || "N/A"}
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

              {!b.adminApproval && (
                <p className="text-yellow-600 dark:text-yellow-400 mt-1">
                  Awaiting Admin Completion
                </p>
              )}

              {b.adminApproval && b.paymentStatus === "Unpaid" && (
                <button
                  onClick={() => handlePayNow(b._id, b.service.title, b.totalPrice)}
                  disabled={loadingPaymentId === b._id}
                  className={`mt-2 px-4 py-2 rounded-lg text-white shadow transition ${
                    loadingPaymentId === b._id
                      ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                  }`}
                >
                  {loadingPaymentId === b._id ? "Redirecting..." : "Pay Now"}
                </button>
              )}

              {b.status === "Completed" &&
                b.paymentStatus === "Paid" &&
                b.provider?._id && (
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
    </div>
  );
};

export default ClientBookings;
