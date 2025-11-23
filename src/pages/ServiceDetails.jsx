import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

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
    return <p className="text-center mt-10 text-lg">Loading...</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10 max-w-3xl"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-4"
      >
        {service.title}
      </motion.h1>

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white shadow-lg rounded-xl p-6"
      >
        <p className="text-gray-700">{service.description}</p>
        <p className="text-xl mt-3 font-semibold">Price: ₹{service.price}</p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/book/${service._id}`)}
          className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
        >
          Book This Service
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default ServiceDetails;
