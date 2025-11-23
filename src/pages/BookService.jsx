import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");

  useEffect(() => {
    API.get(`/services/${serviceId}`).then((res) => {
      setService(res.data.service || res.data);
    });
  }, [serviceId]);

  const handleBooking = async () => {
    if (!date) return alert("Please select a date!");
    if (!pickupLocation || !dropLocation)
      return alert("Please enter pickup & drop locations");

    let booking;
    try {
      const bookingRes = await API.post("/bookings", {
        provider: service.provider._id,
        service: serviceId,
        pickupLocation,
        dropLocation,
        date,
        totalPrice: service.price,
      });

      booking = bookingRes.data.booking;
    } catch (err) {
      console.log(err.response?.data);
      return;
    }

    const stripeRes = await API.post("/payments/create-checkout-session", {
      bookingId: booking._id,
      amount: service.price,
      serviceName: service.title,
    });

    window.location.href = stripeRes.data.url;
  };

  if (!service) return <p>Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 max-w-lg mx-auto"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white shadow-xl rounded-xl p-6"
      >
        <h1 className="text-2xl font-bold mb-4">Book: {service.title}</h1>

        <label className="block text-sm font-semibold mb-2">
          Pickup Location
        </label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 focus:border-indigo-500 focus:ring-indigo-500"
          value={pickupLocation}
          onChange={(e) => setPickupLocation(e.target.value)}
        />

        <label className="block text-sm font-semibold mb-2">
          Drop Location
        </label>
        <input
          type="text"
          className="w-full border px-3 py-2 rounded mb-4 focus:border-indigo-500"
          value={dropLocation}
          onChange={(e) => setDropLocation(e.target.value)}
        />

        <label className="block text-sm font-semibold mb-2">
          Choose Date
        </label>
        <input
          type="date"
          className="w-full border px-3 py-2 rounded focus:border-indigo-500"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBooking}
          className="mt-6 bg-indigo-600 text-white w-full py-2 rounded"
        >
          Confirm & Pay ₹{service.price}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default BookService;
