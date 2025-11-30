import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";

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
    <div className="p-10 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-semibold mb-8">Available Services</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-xl border shadow-sm p-6 cursor-pointer hover:shadow-md transition"
            onClick={() => navigate(`/services/${service._id}`)}
          >
            <h2 className="text-xl font-semibold">{service.title}</h2>
            <p className="text-gray-600 mt-2">{service.description.slice(0, 60)}...</p>
            <p className="font-bold mt-4 text-blue-600">₹ {service.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceList;


