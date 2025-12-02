import { useState, useEffect } from "react";
import API from "../../../api/api";

const CompletedBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

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

  if (!bookings.length) return <p className="p-10">No bookings found.</p>;

  return (
    <div className="p-10 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Completed Services - Pay Now</h1>
      <div className="flex flex-col gap-4">
        {bookings.map((b) => (
          <div key={b._id} className="p-4 border rounded shadow flex justify-between items-center">
            <div>
              <p><strong>Service:</strong> {b.service?.title}</p>
              <p><strong>Status:</strong> {b.status}</p>
              <p><strong>Total:</strong> ₹{b.totalPrice}</p>
            </div>
            {b.status === "Completed" && !b.isPaid && (
              <button
                onClick={() => handlePayment(b._id)}
                disabled={loading}
                className={`px-4 py-2 rounded text-white ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {loading ? "Processing..." : "Pay Now"}
              </button>
            )}
            {b.isPaid && <span className="text-green-600 font-semibold">Paid</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompletedBookings;
