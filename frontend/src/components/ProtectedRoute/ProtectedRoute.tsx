import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo: string;
  requireAuth?: boolean; // If true, requires login. If false, only works for unauthenticated users.
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo, requireAuth = true }) => {
  const { user } = useAuth();

  if (requireAuth && !user) {
    return <Navigate to={redirectTo} />; // Redirect if login is required but the user is not authenticated
  }

  if (!requireAuth && user) {
    return <Navigate to="/" />; // Redirect if the user is logged in but trying to access a guest-only page
  }

  return <Outlet />;
};

export default ProtectedRoute;
