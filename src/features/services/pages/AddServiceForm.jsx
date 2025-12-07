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
      className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md space-y-4 max-w-xl mx-auto"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Add New Service
      </h3>

      <div className="flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Service Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="flex-1 border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
      </div>

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
      />

      <input
        type="text"
        placeholder="Available Locations (comma separated)"
        value={locations}
        onChange={(e) => setLocations(e.target.value)}
        className="w-full border border-gray-300 dark:border-gray-600 p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-md font-medium text-white transition-colors ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        }`}
      >
        {loading ? "Adding..." : "Add Service"}
      </button>
    </form>
  );
};

export default AddServiceForm;

