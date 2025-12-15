import { Navigate } from "react-router-dom";

export default function ProtectedRoutes({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isVerifiedProvider = localStorage.getItem("isVerifiedProvider"); // correct key

  if (!token) return <Navigate to="/login" replace />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (role === "provider" && isVerifiedProvider === "false") {
    return <Navigate to="/pending-approval" replace />;
  }

  return children;
}
