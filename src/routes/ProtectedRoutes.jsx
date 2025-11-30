import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isVerified = localStorage.getItem("isVerified"); // <-- added

  // Not logged in
  if (!token) return <Navigate to="/login" />;

  // Role mismatch
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  // If Provider but NOT verified → block access
  if (role === "provider" && isVerified === "false") {
    return <Navigate to="/pending-approval" />;
  }

  return children;
}



