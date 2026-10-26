import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
  FaMapMarkerAlt,
  FaTachometerAlt,
  FaBuilding,
  FaClipboardList,
  FaCheckCircle,
  FaRoute,
  FaFileAlt,
  FaShieldAlt,
  FaFolderOpen,
  FaCalendarAlt,
  FaBell,
  FaLocationArrow,
  FaChartBar,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

const FieldExecutiveSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  const menuItemStyle = ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    padding: "12px 20px",
    margin: "4px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: isActive ? 600 : 500,
    backgroundColor: isActive ? "#C9A227" : "transparent",
    color: isActive ? "#111111" : "#FFFFFF",
    transition: "all 0.2s ease",
  });

  const sectionStyle = {
    padding: "20px 20px 5px",
    color: "#888888",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
  };

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
      <div
        style={{
          height: "70px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          borderBottom: "1px solid #333333",
        }}
      >
        <FaMapMarkerAlt
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
              fontWeight: 700,
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
            FIELD EXECUTIVE
          </small>
        </div>
      </div>

      <div style={{ paddingTop: "15px", paddingBottom: "10px" }}>
        <div style={{ ...sectionStyle, paddingTop: "10px" }}>
          Main Menu
        </div>

        <NavLink to="/field/dashboard" style={menuItemStyle}>
          <FaTachometerAlt className="me-3" />
          Dashboard
        </NavLink>

        <NavLink to="/field/properties" style={menuItemStyle}>
          <FaBuilding className="me-3" />
          My Properties
        </NavLink>

        <NavLink to="/field/visits" style={menuItemStyle}>
          <FaClipboardList className="me-3" />
          Assigned Visits
        </NavLink>

        <NavLink to="/field/verification" style={menuItemStyle}>
          <FaCheckCircle className="me-3" />
          Property Verification
        </NavLink>

        <NavLink to="/field/site-visits" style={menuItemStyle}>
          <FaRoute className="me-3" />
          Site Visits
        </NavLink>

        <NavLink to="/field/visit-reports" style={menuItemStyle}>
          <FaFileAlt className="me-3" />
          Visit Reports
        </NavLink>

        <NavLink to="/field/security-reports" style={menuItemStyle}>
          <FaShieldAlt className="me-3" />
          Security Reports
        </NavLink>

        <div style={sectionStyle}>Operations</div>

        <NavLink to="/field/route-navigation" style={menuItemStyle}>
          <FaRoute className="me-3" />
          Route Navigation
        </NavLink>

        <NavLink to="/field/documents" style={menuItemStyle}>
          <FaFolderOpen className="me-3" />
          Documents
        </NavLink>

        <NavLink to="/field/appointments" style={menuItemStyle}>
          <FaCalendarAlt className="me-3" />
          Appointments
        </NavLink>

        <div style={sectionStyle}>Communication</div>

        <NavLink to="/field/notifications" style={menuItemStyle}>
          <FaBell className="me-3" />
          Notifications
        </NavLink>

        <NavLink to="/field/live-location" style={menuItemStyle}>
          <FaLocationArrow className="me-3" />
          Live Location
        </NavLink>

        <div style={sectionStyle}>Reports</div>

        <NavLink to="/field/reports" style={menuItemStyle}>
          <FaChartBar className="me-3" />
          Reports & Analytics
        </NavLink>

        <div style={sectionStyle}>Account</div>

        <NavLink to="/field/profile" style={menuItemStyle}>
          <FaUser className="me-3" />
          Profile
        </NavLink>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            width: "calc(100% - 24px)",
            margin: "4px 12px 20px",
            padding: "12px 20px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "transparent",
            color: "#FFFFFF",
            textAlign: "left",
            fontSize: "14px",
            fontWeight: 500,
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

export default FieldExecutiveSidebar;