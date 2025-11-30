import { useEffect, useState } from "react";
import API from "../api/api";

const EditProfile = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const fetchProfile = async () => {
    const res = await API.get("/users/profile");
    setForm({
      name: res.data.name,
      phone: res.data.phone || "",
      address: res.data.address || "",
    });
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put("/users/edit-profile", form);
    alert("Profile updated successfully!");
  };

  return (
    <div className="p-10 bg-gray-100 min-h-screen">
      <div className="bg-white p-8 rounded-xl shadow-md max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block font-medium">Name</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block font-medium">Phone</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <div>
            <label className="block font-medium">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
