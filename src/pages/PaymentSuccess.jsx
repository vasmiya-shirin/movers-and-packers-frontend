import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";
import ReviewForm from "../features/client/pages/ReviewForm";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const searchParams = new URLSearchParams(location.search);
  const session_id = searchParams.get("session_id");

  useEffect(() => {
    const fetchBooking = async () => {
      if (!session_id) {
        setError("No session_id provided");
        setLoading(false);
        return;
      }

      try {
        const res = await API.get(`/payments/session-booking/${session_id}`);
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Error fetching booking:", err);
        setError(err.response?.data?.message || "Failed to fetch booking");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [session_id]);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-100 dark:bg-green-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">
          Loading booking...
        </p>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-red-100 dark:bg-red-900 p-6">
        <p className="text-xl text-red-700 dark:text-red-300">{error}</p>
        <button
          onClick={() => navigate("/my-bookings")}
          className="mt-4 w-full max-w-xs bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Back to Bookings
        </button>
      </div>
    );

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-green-100 dark:bg-green-900 p-6">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
        Payment Successful! 🎉
      </h1>

      <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md w-full max-w-md">
        <p>
          <strong>Service:</strong> {booking.service?.title || "N/A"}
        </p>
        <p>
          <strong>Provider:</strong> {booking.provider?.name || "N/A"}
        </p>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
        <p>
          <strong>Total:</strong> ₹{booking.totalPrice}
        </p>

        {booking.status?.toLowerCase() === "completed" &&
        booking.paymentStatus?.toLowerCase() === "paid" &&
        booking.provider?._id ? (
          <div className="mt-4">
            <ReviewForm
              bookingId={booking._id}
              providerId={booking.provider._id}
              onSuccess={() => {
                alert("Review submitted!");
                navigate("/my-bookings");
              }}
            />
          </div>
        ) : (
          <p className="mt-4 text-gray-500">
            Review will be available after payment.
          </p>
        )}

        <button
          onClick={() => navigate("/my-bookings")}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg"
        >
          Back to Bookings
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;


