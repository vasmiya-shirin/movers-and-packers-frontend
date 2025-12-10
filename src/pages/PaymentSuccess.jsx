import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/api";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

useEffect(() => {
  const bookingId = new URLSearchParams(location.search).get("bookingId");
  if (bookingId) {
    API.put("/payments/mark-paid", { bookingId })
      .then(() => console.log("Payment updated to Paid"))
      .catch((err) => console.error(err));
  }

  const timer = setTimeout(() => navigate("/my-bookings"), 2000);
  return () => clearTimeout(timer);
}, [location, navigate]);


  return (
    <div className="h-screen flex justify-center items-center bg-green-100 dark:bg-green-900">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
        Payment Successful! 🎉 Updating your booking...
      </h1>
    </div>
  );
};

export default PaymentSuccess;


