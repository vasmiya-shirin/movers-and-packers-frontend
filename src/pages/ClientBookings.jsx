import { useEffect, useState } from "react";
import API from "../api/api";
import { motion } from "framer-motion";

function ClientBookings() {
  const [bookings, setBookings] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await API.get("/bookings/my-bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8"
    >
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="grid gap-4">
          {bookings.map((b, i) => (
            <motion.div
              key={b._id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 bg-white shadow rounded-xl"
            >
              <h3 className="text-xl font-semibold">{b.service?.title}</h3>
              <p>Date: {new Date(b.date).toLocaleDateString()}</p>
              <p>
                Status: <strong>{b.status}</strong>
              </p>

              {b.status !== "cancelled" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
                >
                  Cancel Booking
                </motion.button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

export default ClientBookings;
