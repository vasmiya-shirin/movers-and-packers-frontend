import React from "react";
import { useNavigate } from "react-router-dom";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg max-w-md text-center border dark:border-gray-700">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Account Under Verification
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-4">
          Your provider profile is currently being reviewed by the admin team. 
          You will be notified once your account is approved.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium px-6 py-3 rounded-lg shadow-md transition"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;


