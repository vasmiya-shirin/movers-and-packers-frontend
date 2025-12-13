import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";
import ReviewForm from "../../client/pages/ReviewForm";
import ChatBox from "../../../components/ChatBox";

const TRACKING_STEPS = [
  "Booked",
  "Packing Started",
  "In Transit",
  "Out for Delivery",
  "Delivered",
];

const ClientBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loadingPaymentId, setLoadingPaymentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const res = await API.get("/bookings/my");
      const validBookings = (res.data.bookings || []).filter(
        (b) => b.service !== null
      );
      setBookings(validBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "text-yellow-500";
      case "accepted":
        return "text-blue-500";
      case "completed":
        return "text-green-500";
      case "approved":
        return "text-purple-500";
      case "rejected":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-lg dark:text-gray-200">
        Loading bookings...
      </p>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-gray-100 dark:bg-gray-900 min-h-screen">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookings.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 col-span-full">
            No bookings found.
          </p>
        ) : (
          bookings.map((b) => {
            const trackingStatus = b.trackingStatus || "Booked";
            return (
              <div
                key={b._id}
                className="bg-white dark:bg-gray-800 p-6 border border-gray-200 dark:border-gray-700 shadow rounded-xl flex flex-col justify-between"
              >
                {/* Header */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  {b.service?.title || "Service"}
                </h2>

                {/* Booking Info */}
                <div className="space-y-1 text-gray-700 dark:text-gray-300 mb-3">
                  <p>
                    <strong>Status:</strong>{" "}
                    <span className={getStatusColor(b.status)}>
                      {b.status || "N/A"}
                    </span>
                  </p>
                  <p>
                    <strong>Payment:</strong>{" "}
                    <span
                      className={
                        b.paymentStatus?.toLowerCase() === "paid"
                          ? "text-green-500 dark:text-green-400"
                          : "text-red-500 dark:text-red-400"
                      }
                    >
                      {b.paymentStatus || "Unpaid"}
                    </span>
                  </p>
                  <p>
                    <strong>Pickup:</strong> {b.pickupLocation || "N/A"}
                  </p>
                  <p>
                    <strong>Drop:</strong> {b.dropLocation || "N/A"}
                  </p>
                  {b.provider ? (
                    <>
                      <p>
                        <strong>Provider:</strong> {b.provider.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {b.provider.email}
                      </p>
                    </>
                  ) : (
                    <p>Provider info not available</p>
                  )}
                </div>

                {/* Tracking Steps */}
                <div className="mb-3">
                  <p className="font-semibold mb-1 text-gray-700 dark:text-gray-300">
                    Tracking Status
                  </p>
                  <div className="flex gap-1 flex-wrap">
                    {TRACKING_STEPS.map((step, index) => {
                      const active =
                        TRACKING_STEPS.indexOf(trackingStatus) >= index;
                      return (
                        <span
                          key={step}
                          className={`text-[10px] px-2 py-1 rounded-full mb-1 ${
                            active
                              ? "bg-green-500 text-white"
                              : "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200"
                          }`}
                        >
                          {step}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-auto">
                  <button
                    onClick={() => setSelectedBooking(b)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                  >
                    Chat with Provider
                  </button>

                  {b.status?.toLowerCase() === "approved" &&
                    b.paymentStatus === "Unpaid" && (
                      <button
                        onClick={() =>
                          handlePayNow(b._id, b.service.title, b.totalPrice)
                        }
                        disabled={loadingPaymentId === b._id}
                        className={`px-4 py-2 rounded-lg text-white shadow transition ${
                          loadingPaymentId === b._id
                            ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                        }`}
                      >
                        {loadingPaymentId === b._id
                          ? "Redirecting..."
                          : "Pay Now"}
                      </button>
                    )}

                  {b.status?.toLowerCase() === "approved" &&
                    b.paymentStatus?.toLowerCase() === "paid" &&
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

                {/* ChatBox */}
                {selectedBooking?._id === b._id && (
                  <ChatBox
                    booking={selectedBooking}
                    currentUser={user}
                    onClose={() => setSelectedBooking(null)}
                  />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ClientBookings;
