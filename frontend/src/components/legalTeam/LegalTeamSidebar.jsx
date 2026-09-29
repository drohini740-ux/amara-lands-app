import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaBalanceScale,
  FaTachometerAlt,
  FaGavel,
  FaComments,
  FaCalendarAlt,
  FaBuilding,
  FaFileAlt,
  FaBell,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const LegalTeamSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const menuItemStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    margin: "4px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive ? "600" : "500",

    backgroundColor: isActive
      ? "#C9A227"
      : "transparent",

    color: isActive
      ? "#111111"
      : "#FFFFFF",

    transition: "all 0.2s ease",
  });

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "#111111",
        color: "#FFFFFF",
        overflowY: "auto",
        zIndex: 1000,
        borderRight: "1px solid #C9A227",
      }}
    >
      {/* LOGO */}

      <div
        style={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #333333",
        }}
      >
        <FaBalanceScale
          style={{
            color: "#C9A227",
            fontSize: "26px",
            marginRight: "10px",
          }}
        />

        <div>
          <div
            style={{
              color: "#FFFFFF",
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            Amara Lands
          </div>

          <small
            style={{
              color: "#C9A227",
              fontSize: "11px",
            }}
          >
            LEGAL TEAM
          </small>
        </div>
      </div>

      {/* MENU */}

      <div style={{ paddingTop: "15px" }}>
        <div
          style={{
            padding: "10px 20px 5px",
            color: "#888888",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Main Menu
        </div>

        <NavLink
          to="/legal-team/dashboard"
          style={menuItemStyle}
        >
          <FaTachometerAlt className="me-3" />
          Dashboard
        </NavLink>

        <NavLink
          to="/legal-team/cases"
          style={menuItemStyle}
        >
          <FaGavel className="me-3" />
          Legal Cases
        </NavLink>

        <NavLink
          to="/legal-team/consultations"
          style={menuItemStyle}
        >
          <FaComments className="me-3" />
          Consultations
        </NavLink>

        <NavLink
          to="/legal-team/appointments"
          style={menuItemStyle}
        >
          <FaCalendarAlt className="me-3" />
          Appointments
        </NavLink>

        <NavLink
          to="/legal-team/properties"
          style={menuItemStyle}
        >
          <FaBuilding className="me-3" />
          Properties
        </NavLink>

        <NavLink
          to="/legal-team/documents"
          style={menuItemStyle}
        >
          <FaFileAlt className="me-3" />
          Documents
        </NavLink>

        {/* COMMUNICATION */}

        <div
          style={{
            padding: "20px 20px 5px",
            color: "#888888",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Communication
        </div>

        <NavLink
          to="/legal-team/notifications"
          style={menuItemStyle}
        >
          <FaBell className="me-3" />
          Notifications
        </NavLink>

        {/* REPORTS */}

        <div
          style={{
            padding: "20px 20px 5px",
            color: "#888888",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Reports
        </div>

        <NavLink
          to="/legal-team/reports"
          style={menuItemStyle}
        >
          <FaChartBar className="me-3" />
          Reports & Analytics
        </NavLink>

        {/* ACCOUNT */}

        <div
          style={{
            padding: "20px 20px 5px",
            color: "#888888",
            fontSize: "11px",
            fontWeight: "700",
            textTransform: "uppercase",
          }}
        >
          Account
        </div>

        <NavLink
          to="/legal-team/profile"
          style={menuItemStyle}
        >
          <FaUser className="me-3" />
          Profile
        </NavLink>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          style={{
            width: "calc(100% - 24px)",
            margin: "4px 12px 20px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#FFFFFF",
            textAlign: "left",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
          }}
        >
          <FaSignOutAlt className="me-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default LegalTeamSidebar;