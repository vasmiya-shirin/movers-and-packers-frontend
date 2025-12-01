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

      onUploaded();
      alert("Documents uploaded successfully!");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleUpload}>
      <input
        type="file"
        multiple
        onChange={(e) => setFiles(e.target.files)}
        className="mb-4"
      />

      <button
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded"
      >
        {loading ? "Uploading..." : "Upload Documents"}
      </button>
    </form>
  );
};

export default VerificationUpload;