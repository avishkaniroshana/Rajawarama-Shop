import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AdminProtectedRoute = ({ children }) => {
  const { isLoggedIn, userRole } = useAuth();

  console.log("AdminProtectedRoute check:", { isLoggedIn, userRole });

  if (!isLoggedIn || userRole !== "ADMIN") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
