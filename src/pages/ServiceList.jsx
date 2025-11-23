import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    API.get("/services").then((res) => {
      setServices(res.data);
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-10"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-3xl font-bold mb-8"
      >
        Available Services
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service._id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03 }}
            className="bg-white p-6 shadow-lg rounded-xl"
          >
            <h2 className="text-xl font-bold">{service.title}</h2>
            <p className="text-gray-600 my-2">{service.description}</p>
            <p className="font-semibold text-indigo-600">
              Price: ₹{service.price}
            </p>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
              onClick={() => navigate(`/services/${service._id}`)}
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ServiceList;


