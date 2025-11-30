import React from "react";

function PendingApproval() {
  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold">Account Under Verification</h1>
      <p className="text-gray-600 mt-3">
        Your provider profile is pending admin approval. You will get access
        once approved.
      </p>
    </div>
  );
}

export default PendingApproval;
