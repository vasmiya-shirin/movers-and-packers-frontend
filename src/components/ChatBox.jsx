import { useEffect, useState } from "react";
import API from "../api/api";

const ChatBox = ({ bookingId }) => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  const fetchMessages = async () => {
    if (!bookingId) return;
    try {
      const res = await API.get(`/messages/${bookingId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [bookingId]);

  const sendMessage = async () => {
    if (!text.trim() || !bookingId) return;
    try {
      await API.post("/messages", { bookingId, message: text });
      setText("");
      fetchMessages(); // refresh messages
    } catch (err) {
      console.error(err);
    }
  };

  if (!bookingId) return <p>Select a booking to chat</p>;

  return (
    <div className="border p-4 rounded-lg">
      <div className="h-64 overflow-y-auto mb-2 border-b pb-2">
        {messages.map((m) => (
          <div key={m._id} className="mb-1">
            <span className="font-semibold">{m.sender?.name || "You"}: </span>
            {m.message}
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 flex-1 rounded"
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};


export default ChatBox;

