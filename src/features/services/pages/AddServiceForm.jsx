import { useState } from "react";
import API from "../../../api/api";

const AddServiceForm = ({ onServiceAdded }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [locations, setLocations] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!title.trim()) newErrors.title = "Title is required";
    else if (title.trim().length < 3)
      newErrors.title = "Title must be at least 3 characters";

    if (description && description.length > 500)
      newErrors.description = "Description too long";

    if (price === "") newErrors.price = "Price is required";
    else if (isNaN(price) || Number(price) < 0)
      newErrors.price = "Price must be a positive number";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/services", {
        title,
        description,
        price: Number(price),
        availableLocations: locations
          .split(",")
          .map((l) => l.trim())
          .filter((l) => l),
      });

      alert("Service added successfully!");
      setTitle("");
      setDescription("");
      setPrice("");
      setLocations("");

      if (onServiceAdded) onServiceAdded(res.data);
    } catch (err) {
      console.error("Error adding service:", err);
      alert(err.response?.data?.message || "Failed to add service");
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
        <div className="flex-1">
          <input
            type="text"
            placeholder="Service Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.title && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.title}
            </p>
          )}
        </div>

        <div className="flex-1">
          <input
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.price && (
            <p className="text-red-500 dark:text-red-400 text-sm mt-1">
              {errors.price}
            </p>
          )}
        </div>
      </div>

      <div>
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none h-24"
        />
        {errors.description && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.description}
          </p>
        )}
      </div>

      <div>
        <input
          type="text"
          placeholder="Available Locations (comma separated)"
          value={locations}
          onChange={(e) => setLocations(e.target.value)}
          className="w-full border p-3 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

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
