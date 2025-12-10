import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract bookingId from URL
  const bookingId = new URLSearchParams(location.search).get("bookingId");

  useEffect(() => {
    if (bookingId) {
      API.put("/payments/mark-paid", { bookingId })
        .then(() => {
          console.log("Payment status updated to Paid");
        })
        .catch((err) => console.error("Error updating payment:", err));
    }

    const timer = setTimeout(() => {
      navigate("/my-bookings");
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate, bookingId]);

  return (
    <div className="h-screen flex justify-center items-center bg-green-100 dark:bg-green-900">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
        Payment Successful! 🎉 Updating your booking...
      </h1>
    </div>
  );
};

export default PaymentSuccess;


