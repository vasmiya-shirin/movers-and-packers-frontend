import { useEffect, useState } from "react";
import API from "../../../api/api";

const AdminInbox = () => {
  const [contactMessages, setContactMessages] = useState([]);

  const fetchContactMessages = async () => {
    try {
      const res = await API.get("/contact/admin/all");
      setContactMessages(res.data || []);
    } catch (err) {
      console.error("Error fetching contact messages:", err);
    }
  };

  useEffect(() => {
    fetchContactMessages();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
        Contact Messages
      </h2>

      {contactMessages.length === 0 ? (
        <p className="text-gray-700 dark:text-gray-300">No messages yet.</p>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {contactMessages.map((msg) => (
            <div
              key={msg._id}
              className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow border dark:border-gray-700 transition hover:shadow-md"
            >
              <p className="font-semibold text-gray-900 dark:text-gray-100">
                {msg.name} <span className="font-normal text-gray-500 dark:text-gray-400">({msg.email})</span>
              </p>
              <p className="mt-1 text-gray-700 dark:text-gray-300">{msg.message}</p>
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminInbox;


