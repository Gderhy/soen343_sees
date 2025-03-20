import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { SystemRole } from "../../types";

interface ProtectedRouteProps {
  redirectTo: string;
  requireAuth?: boolean; // If true, requires login. If false, only works for unauthenticated users.
  requiredSystemRole?: SystemRole; // If true, requires admin role.
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo, requireAuth = true, requiredSystemRole = "user" }) => {
  const { user,  systemRole } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to={redirectTo} />; // Redirect if login is required but the user is not authenticated
  }

  if (!requireAuth && user) {
    return <Navigate to="/" />; // Redirect if the user is logged in but trying to access a guest-only page
  }

  if (systemRole !== requiredSystemRole) {
    return <Navigate to="/" />; // Redirect if the user is not an admin
  }

  return <Outlet />;
};

export default ProtectedRoute;
