import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface ProtectedRouteProps {
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ redirectTo }) => {
  const { user } = useAuth();

  return user ? <Outlet /> : <Navigate to={redirectTo} />;
};

export default ProtectedRoute;
