import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/api";

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch service details
  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${serviceId}`);
        setService(res.data.service || res.data);
      } catch (err) {
        console.log("Error fetching service:", err);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleBooking = async () => {
  if (!date) return alert("Please select a date!");
  if (!pickupLocation || !dropLocation)
    return alert("Please enter pickup & drop locations");

  setLoading(true);

  try {
    // 1️⃣ Create Booking
    const bookingRes = await API.post("/bookings", {
      service: serviceId,
      pickupLocation,
      dropLocation,
      date,
      totalPrice: service.price,
    });

    const booking = bookingRes.data.booking;

    // 2️⃣ Create Stripe Checkout Session
    const stripeRes = await API.post("/payments/create-checkout-session", {
      bookingId: booking._id,
      amount: service.price,
      serviceName: service.title,
    });

    window.location.href = stripeRes.data.url;

  } catch (err) {
    const msg = err?.response?.data?.message;

    console.log("Booking error:", msg || err.message);

    // 🔥 If payment is not allowed yet (service not completed)
    if (msg === "Payment is allowed only for completed services.") {
      alert(msg);

      // 👉 REDIRECT to Completed Services page
      navigate("/client/completed-bookings");

      return;
    }

    // Default error
    alert(msg || "Something went wrong while booking the service.");

  } finally {
    setLoading(false);
  }
};


  if (!service)
    return <p className="p-10 text-gray-700 dark:text-gray-300">Loading service...</p>;

  return (
    <div className="p-10 max-w-lg mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 shadow-sm rounded-xl p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
          Book: {service.title}
        </h1>

        {/* Pickup Location */}
        <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">
          Pickup Location
        </label>
        <input
          type="text"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded mb-4 
                     focus:ring-2 focus:ring-indigo-500"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
          placeholder="Enter pickup location"
        />

        {/* Drop Location */}
        <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">
          Drop Location
        </label>
        <input
          type="text"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded mb-4 
                     focus:ring-2 focus:ring-indigo-500"
          value={dropLocation}
          onChange={(e) => setDropLocation(e.target.value)}
          placeholder="Enter drop location"
        />

        {/* Date */}
        <label className="block text-sm font-semibold mb-2 text-gray-800 dark:text-gray-300">
          Choose Date
        </label>
        <input
          type="date"
          className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded mb-4 
                     focus:ring-2 focus:ring-indigo-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        {/* Confirm Button */}
        <button
          onClick={handleBooking}
          className={`mt-6 w-full py-2 rounded-lg font-medium text-white transition 
            ${
              loading
                ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
            }`}
          disabled={loading}
        >
          {loading ? "Processing..." : `Confirm & Pay ₹${service.price}`}
        </button>
      </div>
    </div>
  );
};

export default BookService;