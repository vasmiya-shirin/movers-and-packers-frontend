import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api/api";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    API.get(`/services/${id}`).then((res) => {
      setService(res.data);
    });
  }, [id]);

  if (!service) return <p>Loading...</p>;

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-4">{service.title}</h1>

      <p className="text-gray-700">{service.description}</p>
      <p className="text-xl mt-3 font-semibold">Price: ₹{service.price}</p>

      <button
        onClick={() => navigate(`/book/${service._id}`)}
        className="mt-6 bg-green-600 text-white px-4 py-2 rounded"
      >
        Book This Service
      </button>
    </div>
  );
};

export default ServiceDetails;
