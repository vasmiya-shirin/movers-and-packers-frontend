import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../../../api/api";

const EditService = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState({
    title: "",
    description: "",
    price: "",
    availableLocations: [],
  });

  useEffect(() => {
    API.get(`/services/${id}`)
      .then((res) => setService(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/services/${id}`, service);
      alert("Service updated successfully!");
      navigate("/admin-dashboard"); // go back to dashboard
    } catch (err) {
      console.log(err);
      alert("Failed to update service");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Edit Service</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={service.title}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={service.description}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={service.price}
          onChange={handleChange}
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="availableLocations"
          placeholder="Locations (comma separated)"
          value={service.availableLocations.join(", ")}
          onChange={(e) =>
            setService({
              ...service,
              availableLocations: e.target.value.split(",").map((l) => l.trim()),
            })
          }
          className="p-2 border rounded"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update Service
        </button>
      </form>
    </div>
  );
};

export default EditService;
