import { useState } from "react";
import API from "../../../api/api";

const AddServiceForm = ({ onServiceAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [locations, setLocations] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price) {
      alert("Title and Price are required");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/services", {
        title,
        description,
        price,
        availableLocations: locations
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l),
      });

      alert("Service added successfully!");

      // Clear form
      setTitle("");
      setDescription("");
      setPrice("");
      setLocations("");

      if (onServiceAdded) onServiceAdded(res.data);
    } catch (err) {
      console.error("Error adding service:", err);
      alert("Failed to add service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow mb-6"
    >
      <h3 className="text-lg font-bold mb-3 text-gray-800 dark:text-gray-200">
        Add New Service
      </h3>

      <input
        type="text"
        placeholder="Service Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 p-2 rounded mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 p-2 rounded mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 p-2 rounded mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
        required
      />

      <input
        type="text"
        placeholder="Available Locations (comma separated)"
        value={locations}
        onChange={(e) => setLocations(e.target.value)}
        className="border border-gray-300 dark:border-gray-600 p-2 rounded mb-2 w-full bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-4 py-2 rounded w-full font-medium ${
          loading
            ? "bg-gray-400 cursor-not-allowed text-gray-200"
            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Adding..." : "Add Service"}
      </button>
    </form>
  );
};

export default AddServiceForm;
