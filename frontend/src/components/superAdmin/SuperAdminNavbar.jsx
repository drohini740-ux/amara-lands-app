import React from "react";
import { useNavigate } from "react-router-dom";
import { FaUserShield, FaSignOutAlt } from "react-icons/fa";

const SuperAdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <nav
      className="d-flex justify-content-between align-items-center px-4"
      style={{
        height: "70px",
        backgroundColor: "#111111",
        borderBottom: "1px solid #C9A227",
      }}
    >
      {/* LEFT */}
      <div>
        <h5
          className="mb-0"
          style={{
            color: "#FFFFFF",
            fontWeight: "600",
          }}
        >
          Super Admin Control Panel
        </h5>

        <small style={{ color: "#C9A227" }}>
          Amara Lands
        </small>
      </div>

      {/* RIGHT */}
      <div className="d-flex align-items-center gap-3">

        <div
          className="d-flex align-items-center gap-2"
          style={{
            color: "#FFFFFF",
          }}
        >
          <FaUserShield
            style={{
              color: "#C9A227",
              fontSize: "20px",
            }}
          />

          <span>
            Super Admin
          </span>
        </div>

        <button
          className="btn"
          onClick={handleLogout}
          style={{
            color: "#C9A227",
            border: "1px solid #C9A227",
            backgroundColor: "transparent",
          }}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>

      </div>
    </nav>
  );
};

export default SuperAdminNavbar;