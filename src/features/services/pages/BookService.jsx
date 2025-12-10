import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [date, setDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${serviceId}`);
        const fetchedService = res.data.service || res.data;
        setService(fetchedService);
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
      // Create booking (payment will be done after admin completion)
      const bookingRes = await API.post("/bookings", {
        service: serviceId,
        pickupLocation,
        dropLocation,
        date,
        totalPrice: service.price,
      });

      alert(
        "Booking created successfully! You will pay after admin completes the service."
      );
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to create booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!service)
    return (
      <div className="p-10 text-center text-gray-700 dark:text-gray-300 min-h-screen flex items-center justify-center">
        Loading service...
      </div>
    );

  return (
    <div className="p-4 sm:p-6 md:p-10 max-w-md mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">
          Book: {service.title}
        </h1>

        <div className="space-y-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-300">
              Pickup Location
            </label>
            <input
              type="text"
              placeholder="Enter pickup location"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-300">
              Drop Location
            </label>
            <input
              type="text"
              placeholder="Enter drop location"
              value={dropLocation}
              onChange={(e) => setDropLocation(e.target.value)}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-1 text-gray-800 dark:text-gray-300">
              Choose Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border dark:border-gray-600 dark:bg-gray-700 dark:text-white px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleBooking}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-lg font-medium text-white text-center transition ${
            loading
              ? "bg-gray-400 dark:bg-gray-600 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600"
          }`}
        >
          {loading ? "Processing..." : `Confirm Booking`}
        </button>
      </div>
    </div>
  );
};

export default BookService;

