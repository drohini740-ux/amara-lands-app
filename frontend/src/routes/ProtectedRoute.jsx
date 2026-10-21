
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const location = useLocation();

  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("user");

  if (!token || !userData) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  let user;

  try {
    user = JSON.parse(userData);
  } catch (error) {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  if (
    !user?.role ||
    (allowedRoles.length > 0 &&
      !allowedRoles.includes(user.role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
