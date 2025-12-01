import { useState } from "react";
import API from "../../../api/api";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ bookingId, providerId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const submitReview = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      alert("Please write a comment before submitting.");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/reviews", {
        booking: bookingId,
        provider: providerId,
        rating,
        comment,
      });

      console.log("Review Submitted:", res.data);

      setComment("");
      setRating(5);
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Review error:", error);
      alert("Failed to submit review");
    }

    setLoading(false);
  };

  return (
    <form
      onSubmit={submitReview}
      className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border mt-6"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Leave a Review
      </h2>

      {/* ⭐ STAR RATING ⭐ */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Rating
        </label>

        <div className="flex gap-2 text-2xl">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={28}
              className="cursor-pointer transition-transform duration-150"
              color={(hover || rating) >= star ? "#facc15" : "#d1d5db"}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
      </div>

      {/* COMMENT */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Your Feedback
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="border dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-300 transition"
          placeholder="Share your experience..."
          rows={4}
        />
      </div>

      {/* SUBMIT BUTTON */}
      <button
        disabled={loading}
        className={`w-full py-2 rounded-lg text-white font-medium transition 
          ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"}`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
