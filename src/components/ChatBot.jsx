import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { IoChatbubbleEllipsesOutline, IoClose } from "react-icons/io5";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await axios.post("http://localhost:5000/api/chat", {
        message: input,
      });

      const botMsg = { sender: "bot", text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [...prev, { sender: "bot", text: "Error connecting to server" }]);
    }

    setInput("");
  };

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-3xl z-50"
        >
          <IoChatbubbleEllipsesOutline />
        </button>
      )}

      {/* ChatBot Popup */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 right-6 w-80 md:w-96 bg-white rounded-xl shadow-2xl border z-50"
          >
            {/* Header */}
            <div className="flex justify-between items-center px-4 py-3 border-b bg-blue-600 text-white rounded-t-xl">
              <h2 className="font-semibold text-lg">ChatBot</h2>
              <button
                onClick={() => setOpen(false)}
                className="text-white text-2xl hover:text-gray-200"
              >
                <IoClose />
              </button>
            </div>

            {/* Messages */}
            <div className="h-72 overflow-y-auto p-4 bg-gray-50">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-2 flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-3 py-2 rounded-lg max-w-[70%] text-sm ${
                      m.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex p-3 border-t bg-white">
              <input
                className="flex-1 border rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-2 bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-md"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
