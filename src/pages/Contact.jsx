import { useState } from "react";
import API from "../api/api";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!name || !email || !message) {
      return alert("Please fill all fields");
    }

    setLoading(true);

    try {
      const res = await API.post("/contact/send", {
        name,
        email,
        message,
      });

      alert("Message sent successfully!");
      setName("");
      setEmail("");
      setMessage("");

    } catch (err) {
      alert(err.response?.data?.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen px-6 py-12 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-6">Contact Us</h1>

        <p className="text-lg mb-6">
          Have questions? Need support? We're here to help you!
        </p>

        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>

          <p className="mb-2"><strong>Email:</strong> support@moverspackers.com</p>
          <p className="mb-2"><strong>Phone:</strong> +1 987 654 3210</p>
          <p className="mb-2"><strong>Address:</strong> Doha, Qatar</p>
        </div>

        <h2 className="text-2xl font-semibold mt-10 mb-4">Send a Message</h2>

        <form className="space-y-4" onSubmit={handleSend}>
          <input
            type="text"
            placeholder="Your Name"
            className="w-full p-3 rounded border dark:bg-gray-800 dark:border-gray-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Your Email"
            className="w-full p-3 rounded border dark:bg-gray-800 dark:border-gray-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            className="w-full p-3 rounded border dark:bg-gray-800 dark:border-gray-700"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          ></textarea>

          <button
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}
