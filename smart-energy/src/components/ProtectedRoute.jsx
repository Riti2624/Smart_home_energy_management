import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const isAuth = token !== null && token !== "";
  return isAuth ? children : <Navigate to="/login" />;
}