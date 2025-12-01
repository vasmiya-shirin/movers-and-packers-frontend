import { useEffect, useState, useRef } from "react";
import API from "../api/api";

const ChatBox = ({ booking, onClose, currentUser }) => {
  const bookingId = booking?._id;
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch messages for the booking
  const fetchMessages = async () => {
    if (!bookingId) return;
    try {
      const res = await API.get(`/messages/${bookingId}`);
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-fetch messages every 5 seconds
  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [bookingId]);

  // Auto-scroll to bottom on messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!text.trim() || !bookingId) return;
    try {
      await API.post("/messages", { bookingId, message: text });
      setText("");
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  if (!bookingId) return <p>Select a booking to chat</p>;

  return (
    <div className="fixed right-0 bottom-0 w-96 max-h-full bg-white dark:bg-gray-800 border-l border-gray-300 dark:border-gray-700 flex flex-col z-50">
      {/* Header */}
      <div className="flex justify-between p-3 border-b border-gray-200 dark:border-gray-600">
        <h3 className="font-semibold">
          Chat with {booking.provider?.name || booking.client?.name}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-red-500 font-bold px-2 py-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.map((m) => {
          const isCurrentUser = m.sender?._id === currentUser?._id;
          return (
            <div
              key={m._id}
              className={`p-2 rounded-lg max-w-[80%] ${
                isCurrentUser
                  ? "bg-blue-500 text-white ml-auto"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              <span className="font-semibold">{m.sender?.name}: </span>
              {m.message}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-600 flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 border rounded p-2 dark:bg-gray-700 dark:text-white"
          placeholder="Type your message..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 rounded disabled:bg-gray-300"
          disabled={!text.trim()}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
