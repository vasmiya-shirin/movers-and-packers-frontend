import React from "react";
import { useNavigate } from "react-router-dom";

function PendingApproval() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="bg-white dark:bg-gray-800 p-10 rounded-xl shadow-lg max-w-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Account Under Verification
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mt-3">
          Your provider profile is being reviewed by the admin team.
        </p>

        <button
          onClick={() => navigate("/")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
        >
          Go to Home
        </button>
      </div>
    </div>
  );
}

export default PendingApproval;

