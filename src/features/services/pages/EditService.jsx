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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await API.get(`/services/${id}`);
        setService(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchService();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.put(`/services/${id}`, service);
      alert("Service updated successfully!");
      navigate(-1);
    } catch (err) {
      console.log(err);
      alert("Failed to update service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-900 dark:text-white">
        Edit Service
      </h1>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md bg-white dark:bg-gray-800 p-6 rounded-xl shadow"
      >
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={service.title}
          onChange={handleChange}
          className="p-3 border dark:border-gray-600 rounded w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <textarea
          name="description"
          placeholder="Description"
          value={service.description}
          onChange={handleChange}
          className="p-3 border dark:border-gray-600 rounded w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={service.price}
          onChange={handleChange}
          className="p-3 border dark:border-gray-600 rounded w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
        />

        <input
          type="text"
          name="availableLocations"
          placeholder="Locations (comma separated)"
          value={service.availableLocations.join(", ")}
          onChange={(e) =>
            setService({
              ...service,
              availableLocations: e.target.value
                .split(",")
                .map((l) => l.trim()),
            })
          }
          className="p-3 border dark:border-gray-600 rounded w-full bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className={`px-4 py-2 rounded-lg w-full font-medium text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
        >
          {loading ? "Updating..." : "Update Service"}
        </button>
      </form>
      <button
        onClick={() => navigate(-1)}
        className="mt-6 w-full sm:w-auto bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow font-medium transition"
      >
        Back
      </button>
    </div>
  );
};

export default EditService;
