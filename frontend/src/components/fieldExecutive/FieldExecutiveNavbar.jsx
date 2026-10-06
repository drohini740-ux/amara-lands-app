
import React from "react";

import {
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

const FieldExecutiveNavbar = () => {
  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData
      ? JSON.parse(userData)
      : null;
  } catch (error) {
    console.error(
      "Invalid user data:",
      error
    );
  }

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
      {/* ============================================= */}
      {/* TITLE */}
      {/* ============================================= */}

      <div>
        <h5
          className="mb-1"
          style={{
            fontWeight: "700",
            color: "#FFFFFF",
          }}
        >
          Field Executive Portal
        </h5>

        <small
          style={{
            color: "#C9A227",
          }}
        >
          Amara Lands
        </small>
      </div>

      {/* ============================================= */}
      {/* RIGHT SIDE */}
      {/* ============================================= */}

      <div className="d-flex align-items-center gap-4">
        {/* NOTIFICATIONS */}

        <div
          style={{
            cursor: "pointer",
          }}
        >
          <FaBell
            style={{
              fontSize: "20px",
              color: "#C9A227",
            }}
          />
        </div>

        {/* USER */}

        <div className="d-flex align-items-center gap-2">
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
                fontWeight: "600",
              }}
            >
              {user?.full_name ||
                user?.name ||
                "Field Executive"}
            </div>

            <small
              style={{
                color: "#CCCCCC",
              }}
            >
              Field Executive
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FieldExecutiveNavbar;

