import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate("/my-bookings");
    }, 2000);
  }, [navigate]);

  return (
    <div className="h-screen flex justify-center items-center bg-green-100">
      <h1 className="text-3xl font-bold text-green-700">
        Payment Successful! 🎉  
      </h1>
    </div>
  );
};

export default PaymentSuccess;
