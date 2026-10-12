
import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaHome,
  FaClipboardCheck,
  FaRoute,
  FaFileAlt,
  FaExclamationTriangle,
  FaVideo,
  FaMapMarkerAlt,
  FaBell,
  FaFile,
  FaCalendarAlt,
  FaChartBar,
  FaUser,
} from "react-icons/fa";

const SecuritySidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/security/dashboard",
      icon: <FaTachometerAlt />,
    },
    {
      name: "Assigned Properties",
      path: "/security/properties",
      icon: <FaHome />,
    },
    {
      name: "Security Visits",
      path: "/security/visits",
      icon: <FaClipboardCheck />,
    },
    {
      name: "Patrol Management",
      path: "/security/patrols",
      icon: <FaRoute />,
    },
    {
      name: "Security Reports",
      path: "/security/reports",
      icon: <FaFileAlt />,
    },
    {
      name: "Incidents & Alerts",
      path: "/security/incidents",
      icon: <FaExclamationTriangle />,
    },
    {
      name: "Motion Alerts",
      path: "/security/motion-alerts",
      icon: <FaExclamationTriangle />,
    },
    {
      name: "Surveillance Cameras",
      path: "/security/cameras",
      icon: <FaVideo />,
    },
    {
      name: "Live Monitoring",
      path: "/security/live-monitoring",
      icon: <FaMapMarkerAlt />,
    },
    {
      name: "Notifications",
      path: "/security/notifications",
      icon: <FaBell />,
    },
    {
      name: "Documents",
      path: "/security/documents",
      icon: <FaFile />,
    },
    {
      name: "Appointments",
      path: "/security/appointments",
      icon: <FaCalendarAlt />,
    },
    {
      name: "Reports & Analytics",
      path: "/security/analytics",
      icon: <FaChartBar />,
    },
    {
      name: "My Profile",
      path: "/security/profile",
      icon: <FaUser />,
    },
  ];

  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: "250px",
        height: "100vh",
        backgroundColor: "#111111",
        color: "#FFFFFF",
        zIndex: 1000,
      }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div
        className="p-4"
        style={{
          borderBottom: "1px solid #333333",
        }}
      >
        <h4
          className="mb-1"
          style={{
            color: "#C9A227",
            fontWeight: "700",
            letterSpacing: "1px",
          }}
        >
          AMARA LANDS
        </h4>

        <small
          style={{
            color: "#FFFFFF",
            opacity: 0.7,
          }}
        >
          Security Portal
        </small>
      </div>

      {/* ================================================= */}
      {/* MENU */}
      {/* ================================================= */}

      <div
        className="p-3"
        style={{
          height: "calc(100vh - 100px)",
          overflowY: "auto",
        }}
      >
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className="text-decoration-none d-flex align-items-center"
            style={({ isActive }) => ({
              color: isActive
                ? "#111111"
                : "#FFFFFF",

              backgroundColor: isActive
                ? "#C9A227"
                : "transparent",

              padding: "11px 13px",
              marginBottom: "5px",
              borderRadius: "6px",

              fontWeight: isActive
                ? "600"
                : "400",

              transition:
                "all 0.2s ease",
            })}
          >
            <span
              className="me-3"
              style={{
                fontSize: "16px",
                minWidth: "20px",
              }}
            >
              {item.icon}
            </span>

            <span
              style={{
                fontSize: "14px",
              }}
            >
              {item.name}
            </span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export default SecuritySidebar;

