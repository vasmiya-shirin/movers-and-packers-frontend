import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/my-bookings");
    }, 2000);

    return () => clearTimeout(timer); // cleanup
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center bg-green-100 dark:bg-green-900">
      <h1 className="text-3xl font-bold text-green-700 dark:text-green-300">
        Payment Successful! 🎉
      </h1>
    </div>
  );
};

export default PaymentSuccess;

