
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  // Read the current tab's session
  const token = sessionStorage.getItem("token");
  const userData = sessionStorage.getItem("user");

  // Redirect users who are not logged in
  if (!token || !userData) {
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
    user = JSON.parse(userData);
  } catch (error) {
    console.error("Invalid user data in sessionStorage:", error);

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }

  const userRole = user?.role;

  // Check whether the user's role can access this portal
  if (
    !userRole ||
    (allowedRoles.length > 0 && !allowedRoles.includes(userRole))
  ) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
