import { useState, useEffect } from "react";
import API from "../../../api/api";
import { useNavigate } from "react-router-dom";

const CompletedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my"); // client bookings
        setBookings(res.data.bookings || []);
      } catch (err) {
        console.error("Error fetching bookings:", err);
      }
    };
    fetchBookings();
  }, []);

  const handlePayment = async (bookingId) => {
    try {
      setLoading(true);
      const res = await API.post("/payments/create-checkout-session", { bookingId });
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  if (!bookings.length)
    return (
      <div className="min-h-screen flex items-center justify-center p-10 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
        No bookings found.
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-3xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
        Completed Services - Pay Now
      </h1>

      <div className="flex flex-col gap-4">
        {bookings.map((b) => (
          <div
            key={b._id}
            className="p-4 sm:p-6 border rounded-xl shadow flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-gray-800 transition"
          >
            <div className="mb-3 sm:mb-0">
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Service: <span className="font-normal">{b.service?.title}</span>
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Status: <span className="font-normal">{b.status}</span>
              </p>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Total: <span className="font-normal">₹{b.totalPrice}</span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              {b.status === "Completed" && !b.isPaid && (
                <button
                  onClick={() => handlePayment(b._id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-lg font-medium text-white transition ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600"
                  }`}
                >
                  {loading ? "Processing..." : "Pay Now"}
                </button>
              )}
              {b.isPaid && (
                <span className="text-green-600 dark:text-green-400 font-semibold">Paid</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => navigate("/client-dashboard")}
        className="mt-6 w-full sm:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow font-medium transition"
      >
        Back to Profile
      </button>
    </div>
  );
};

export default CompletedBookings;

