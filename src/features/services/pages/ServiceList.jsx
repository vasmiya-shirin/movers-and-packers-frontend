import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  // Check if user is logged in
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/services");
        setServices(res.data);
      } catch (error) {
        console.log("Error fetching services:", error);
      }
    };
    fetchServices();
  }, []);

  // Handle click for booking or login
  const handleActionClick = (serviceId) => {
    if (isLoggedIn) {
      navigate(`/services/${serviceId}`); // navigate to booking page
    } else {
      navigate("/login"); // redirect guests to login
    }
  };

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl sm:text-4xl font-semibold mb-8 text-gray-900 dark:text-white">
        Available Services
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 cursor-pointer
                       hover:shadow-lg transition-transform transform hover:-translate-y-1"
          >
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
              {service.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
              {service.description || "No description available"}
            </p>

            {/* AVAILABLE LOCATIONS */}
            <div className="mt-3 flex flex-wrap gap-2">
              {service.availableLocations && service.availableLocations.length > 0 ? (
                service.availableLocations.map((loc, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                  >
                    {loc}
                  </span>
                ))
              ) : (
                <span className="text-gray-500 dark:text-gray-400 text-sm">No locations provided</span>
              )}
            </div>

            <p className="font-bold mt-4 text-lg text-blue-600 dark:text-blue-400">
              ₹ {service.price}
            </p>

            {/* Action Button */}
            <button
              onClick={() => handleActionClick(service._id)}
              className={`mt-4 w-full py-2 rounded text-white ${
                isLoggedIn ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-600 hover:bg-gray-700"
              }`}
            >
              {isLoggedIn ? "Book Now" : "Login to Book"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;

