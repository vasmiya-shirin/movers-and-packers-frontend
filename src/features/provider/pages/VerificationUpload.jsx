import { useState } from "react";
import API from "../../../api/api";

const VerificationUpload = ({ onUploaded }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (files.length === 0) return alert("Please select documents");

    const formData = new FormData();
    for (let file of files) formData.append("documents", file);

    setLoading(true);
    try {
      await API.post("/provider/verify", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onUploaded && onUploaded();
      alert("Documents uploaded successfully!");
      setFiles([]);
    } catch (err) {
      console.error(err);
      alert("Upload failed. Please try again.");
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleUpload}
      className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md border dark:border-gray-700 transition-colors"
    >
      <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
        Upload Verification Documents
      </label>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="block w-full mb-4 text-gray-700 dark:text-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded p-2 cursor-pointer"
      />

      {files.length > 0 && (
        <ul className="mb-4 text-gray-700 dark:text-gray-200">
          {Array.from(files).map((file, index) => (
            <li key={index}>• {file.name}</li>
          ))}
        </ul>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-medium text-white transition 
          ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
      >
        {loading ? "Uploading..." : "Upload Documents"}
      </button>
    </form>
  );
};

export default VerificationUpload;
