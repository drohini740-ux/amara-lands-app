import React from "react";
import { FaBell, FaUserCircle } from "react-icons/fa";

const LegalTeamNavbar = () => {
  const userData = localStorage.getItem("user");

  let user = null;

  try {
    user = userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Invalid user data:", error);
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
        borderBottom: "2px solid #C9A227",
      }}
    >
      {/* LEFT */}

      <div>
        <h5
          className="mb-1"
          style={{
            fontWeight: "700",
            color: "#FFFFFF",
          }}
        >
          Legal Team Portal
        </h5>

        <small
          style={{
            color: "#C9A227",
          }}
        >
          Amara Lands
        </small>
      </div>

      {/* RIGHT */}

      <div className="d-flex align-items-center gap-4">
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
                "Legal Team"}
            </div>

            <small
              style={{
                color: "#CCCCCC",
              }}
            >
              Legal Team
            </small>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default LegalTeamNavbar;