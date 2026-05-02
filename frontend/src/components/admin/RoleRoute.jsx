import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../state/AuthContext";

const RoleRoute = ({ allow, children }) => {
  const { loading, role } = useAuth();
  if (loading) return null;
  if (!role) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return children;
};

export default RoleRoute;

