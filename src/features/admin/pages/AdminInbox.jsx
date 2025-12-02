import { useEffect, useState } from "react";
import API from "../../../api/api";

const AdminInbox = () => {
  const [contactMessages, setContactMessages] = useState([]);

  const fetchContactMessages = async () => {
    try {
      const res = await API.get("/contact/admin/all");
      setContactMessages(res.data);
    } catch (err) {
      console.log("Error fetching contact messages:", err);
    }
  };

  useEffect(() => {
    fetchContactMessages();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Contact Messages</h2>
      {contactMessages.length === 0 && <p>No messages yet.</p>}

      <div className="space-y-3">
        {contactMessages.map((msg) => (
          <div key={msg._id} className="bg-white p-3 rounded shadow">
            <p className="font-semibold">{msg.name} ({msg.email})</p>
            <p>{msg.message}</p>
            <p className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminInbox;

