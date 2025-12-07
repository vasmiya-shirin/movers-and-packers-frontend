import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../../api/api";

const EditProfile = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    profilePic: "",
  });

  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState(null);

  // Fetch existing profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/users/profile");
        setForm({
          name: res.data.name,
          phone: res.data.phone || "",
          address: res.data.address || "",
          profilePic: res.data.profilePic || "",
        });
        setImagePreview(res.data.profilePic);
      } catch (error) {
        console.error("Error loading profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const uploadToCloudinary = async () => {
    if (!file) return form.profilePic;

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      return json.secure_url || form.profilePic;
    } catch (err) {
      console.error("Cloudinary Error:", err);
      alert("Image upload failed.");
      return form.profilePic;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedUrl = await uploadToCloudinary();
      await API.put("/users/edit-profile", { ...form, profilePic: uploadedUrl });
      alert("Profile updated successfully!");
      navigate("/client-dashboard");
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="p-6 sm:p-10 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md max-w-xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-semibold mb-6 text-gray-800 dark:text-gray-100">
          Edit Profile
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-2">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <img
                src={imagePreview || "/default-avatar.png"}
                alt="Profile"
                className="w-20 h-20 rounded-full object-cover border"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 
                  file:mr-4 file:py-2 file:px-4 
                  file:rounded-full file:border-0 
                  file:text-sm file:font-semibold 
                  file:bg-blue-50 file:text-blue-700 
                  hover:file:bg-blue-100"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Phone
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full mt-1 p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-lg transition font-medium"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;


