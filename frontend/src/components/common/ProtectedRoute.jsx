import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  const token = localStorage.getItem("token");
  const userData = localStorage.getItem("user");

  // User is not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error(
      "Invalid user data in localStorage:",
      error
    );

    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  const userRole = user?.role;

  // Check role permission
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(userRole)
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
};

export default ProtectedRoute;