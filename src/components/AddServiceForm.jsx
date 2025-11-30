import { useState } from "react";
import API from "../api/api";

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

      // Notify parent to refresh services list
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
      className="bg-gray-50 p-5 rounded-xl shadow mb-6"
    >
      <h3 className="text-lg font-bold mb-3">Add New Service</h3>

      <input
        type="text"
        placeholder="Service Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
        required
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
        required
      />

      <input
        type="text"
        placeholder="Available Locations (comma separated)"
        value={locations}
        onChange={(e) => setLocations(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add Service"}
      </button>
    </form>
  );
};

export default AddServiceForm;
