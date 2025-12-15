import { useState } from "react";
import API from "../../../api/api";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ bookingId, providerId, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!rating || rating < 1 || rating > 5) {
      newErrors.rating = "Rating must be between 1 and 5";
    }
    if (comment.length > 300) {
      newErrors.comment = "Comment cannot exceed 300 characters";
    }
    return newErrors;
  };

  const submitReview = async (e) => {
    e.preventDefault();
    setErrors({});
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      await API.post("/reviews", {
        booking: bookingId,
        provider: providerId,
        rating,
        comment: comment.trim(),
      });

      setComment("");
      setRating(5);
      onSuccess && onSuccess();
    } catch (error) {
      console.error("Review error:", error);

      const msg =
        error.response?.data?.message ||
        "Failed to submit review. You may have already reviewed this booking.";
      setErrors({ submit: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submitReview}
      className="bg-white dark:bg-gray-800 shadow-md p-6 rounded-xl border mt-6 transition-colors"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Leave a Review
      </h2>

      {/* Star Rating */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Rating
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={28}
              className="cursor-pointer transform transition duration-150 hover:scale-110"
              color={(hover || rating) >= star ? "#facc15" : "#d1d5db"}
              onMouseEnter={() => setHover(star)}
              onMouseLeave={() => setHover(null)}
              onClick={() => setRating(star)}
            />
          ))}
        </div>
        {errors.rating && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.rating}
          </p>
        )}
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
          Your Feedback
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience..."
          rows={4}
          className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600 focus:ring-2 focus:ring-blue-400 transition"
        />
        {errors.comment && (
          <p className="text-red-500 dark:text-red-400 text-sm mt-1">
            {errors.comment}
          </p>
        )}
      </div>

      {/* Submit Error */}
      {errors.submit && (
        <p className="text-red-500 dark:text-red-400 text-sm mb-2">
          {errors.submit}
        </p>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className={`w-full py-3 rounded-lg font-medium text-white transition 
          ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          }`}
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
