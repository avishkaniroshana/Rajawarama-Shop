import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();

  // Use normalized role (already uppercase from AuthContext)
  if (!isLoggedIn || userRole !== "ADMIN") {
    console.warn("Redirecting to /signin – reason:", {
      isLoggedIn,
      userRole,
    });
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
