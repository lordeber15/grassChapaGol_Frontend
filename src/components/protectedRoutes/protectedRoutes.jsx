import { Navigate } from "react-router";

const ProtectedRoutes = ({ children }) => {
  const userData = localStorage.getItem("userData");

  return userData ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoutes;
