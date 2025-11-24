// src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem("access_token");

  // Si no hay token → redirige al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Si hay token → muestra el contenido (el perfil)
  return children;
}