import { Navigate, Outlet } from "react-router-dom";

const PublicRoute = () => {
  const token = localStorage.getItem('token');
  const isAdmin = localStorage.getItem('isAdmin');
  return !token ? <Outlet /> : isAdmin==="true" ? <Navigate to="/admin/dashboard" replace /> : <Navigate to="/home" replace />;
};

export default PublicRoute;