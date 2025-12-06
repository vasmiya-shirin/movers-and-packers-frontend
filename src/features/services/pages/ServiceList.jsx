import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

const ServiceList = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);

  const fetchServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-semibold mb-8 text-gray-900 dark:text-white">
        Available Services
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white dark:bg-gray-800 dark:border-gray-700 rounded-xl border shadow-sm p-6 cursor-pointer 
            hover:shadow-md transition dark:hover:shadow-lg"
            onClick={() => navigate(`/services/${service._id}`)}
          >
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {service.title}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {service.description.slice(0, 60)}...
            </p>

            {/* ✅ AVAILABLE LOCATIONS */}
            <p className="mt-3 text-gray-700 dark:text-gray-300 text-sm">
              <strong>Available Locations:</strong>{" "}
              {service.availableLocations?.length > 0
                ? service.availableLocations.join(", ")
                : "Not provided"}
            </p>

            <p className="font-bold mt-4 text-blue-600 dark:text-blue-400">
              ₹ {service.price}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;
