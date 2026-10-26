import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const FieldExecutiveNavbar = () => {
  const navigate = useNavigate();

  const getUser = () => {
    try {
      const userData =
        sessionStorage.getItem("user") ||
        localStorage.getItem("user");

      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  const user = getUser();

  return (
    <nav
      style={{
        minHeight: "70px",
        backgroundColor: "#111111",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "16px",
        padding: "12px 24px",
        borderBottom: "2px solid #C9A227",
      }}
    >
      <div>
        <h5
          style={{
            margin: 0,
            fontWeight: 700,
            color: "#FFFFFF",
          }}
        >
          Field Executive Portal
        </h5>

        <small style={{ color: "#C9A227" }}>
          Amara Lands
        </small>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
        }}
      >
        <button
          type="button"
          onClick={() => navigate("/field/notifications")}
          aria-label="Open notifications"
          title="Notifications"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            padding: "6px",
          }}
        >
          <FaBell
            style={{
              fontSize: "20px",
              color: "#C9A227",
            }}
          />
        </button>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >
          <FaUserCircle
            style={{
              fontSize: "30px",
              color: "#C9A227",
            }}
          />

          <div>
            <div
              style={{
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {user?.full_name ||
                user?.name ||
                user?.email ||
                "Field Executive"}
            </div>

            <small style={{ color: "#CCCCCC" }}>
              Field Executive
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FieldExecutiveNavbar;