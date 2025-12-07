import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.log("Error fetching service:", err);
      }
    };
    fetchService();
  }, [id]);

  if (!service)
    return (
      <p className="p-10 text-gray-700 dark:text-gray-300">Loading service...</p>
    );

  return (
    <div className="p-6 sm:p-10 max-w-3xl mx-auto min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 sm:p-8">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          {service.title}
        </h1>

        <p className="text-gray-700 dark:text-gray-300 mb-4">{service.description}</p>

        <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-200">
          Price: ₹{service.price}
        </p>

        <button
          onClick={() => navigate(`/book/${service._id}`)}
          className="mt-6 w-full sm:w-auto bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 text-white px-5 py-3 rounded-lg font-medium shadow transition"
        >
          Book This Service
        </button>
      </div>
    </div>
  );
};

export default ServiceDetails;
