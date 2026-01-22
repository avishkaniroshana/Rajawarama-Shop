import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/auth";

const AdminProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  if (!isAuth || role !== "ADMIN") {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
