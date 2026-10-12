
import React from "react";
import { useNavigate } from "react-router-dom";

import {
  FaShieldAlt,
  FaSignOutAlt,
} from "react-icons/fa";

const SecurityNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav
      style={{
        height: "70px",
        backgroundColor: "#111111",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        borderBottom:
          "2px solid #C9A227",
      }}
    >
      {/* ================================================= */}
      {/* TITLE */}
      {/* ================================================= */}

      <div className="d-flex align-items-center">
        <FaShieldAlt
          style={{
            color: "#C9A227",
            fontSize: "22px",
            marginRight: "12px",
          }}
        />

        <div>
          <div
            style={{
              fontWeight: "700",
              fontSize: "16px",
            }}
          >
            Security Portal
          </div>

          <small
            style={{
              color: "#C9A227",
            }}
          >
            Amara Lands
          </small>
        </div>
      </div>

      {/* ================================================= */}
      {/* USER / LOGOUT */}
      {/* ================================================= */}

      <button
        type="button"
        className="btn"
        onClick={handleLogout}
        style={{
          color: "#FFFFFF",
          border:
            "1px solid #C9A227",
          backgroundColor:
            "transparent",
        }}
      >
        <FaSignOutAlt className="me-2" />
        Logout
      </button>
    </nav>
  );
};

export default SecurityNavbar;

