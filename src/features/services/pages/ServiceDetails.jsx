import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/services/${id}`).then((res) => {
      setService(res.data);
    });
  }, [id]);

  if (!service)
    return (
      <p className="p-10 text-gray-700 dark:text-gray-300">Loading...</p>
    );

  return (
    <div className="p-10 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">
        {service.title}
      </h1>

      <p className="text-gray-700 dark:text-gray-300">
        {service.description}
      </p>

      <p className="text-xl mt-3 font-semibold text-gray-900 dark:text-gray-200">
        Price: ₹{service.price}
      </p>

      <button
        onClick={() => navigate(`/book/${service._id}`)}
        className="mt-6 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded 
                   transition dark:bg-green-500 dark:hover:bg-green-600"
      >
        Book This Service
      </button>
    </div>
  );
};

export default ServiceDetails;
