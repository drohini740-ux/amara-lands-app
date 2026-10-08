
import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaUserCog,
  FaHome,
  FaGavel,
  FaShieldAlt,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUserTie,
  FaHeadset,
  FaQuestionCircle,
  FaBell,
  FaChartBar,
  FaHistory,
  FaCog,
  FaLock,
  FaDatabase,
  FaPlug,
  FaMapMarkerAlt,
} from "react-icons/fa";

const SuperAdminSidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/super-admin/dashboard",
      icon: <FaTachometerAlt />,
    },

    {
      name: "User Management",
      path: "/super-admin/users",
      icon: <FaUsers />,
    },

    {
      name: "Roles & Permissions",
      path: "/super-admin/roles",
      icon: <FaUserCog />,
    },

    {
      name: "Property Management",
      path: "/super-admin/properties",
      icon: <FaHome />,
    },

    {
      name: "Legal Management",
      path: "/super-admin/legal",
      icon: <FaGavel />,
    },

    {
      name: "Security Management",
      path: "/super-admin/security",
      icon: <FaShieldAlt />,
    },

    {
      name: "Appointment Management",
      path: "/super-admin/appointments",
      icon: <FaCalendarAlt />,
    },

    {
      name: "Payment Management",
      path: "/super-admin/payments",
      icon: <FaMoneyBillWave />,
    },

    {
      name: "Staff Management",
      path: "/super-admin/staff",
      icon: <FaUserTie />,
    },

    {
      name: "Customer Support",
      path: "/super-admin/support",
      icon: <FaHeadset />,
    },

    {
      name: "FAQ Management",
      path: "/super-admin/faqs",
      icon: <FaQuestionCircle />,
    },

    {
      name: "Notifications",
      path: "/super-admin/notifications",
      icon: <FaBell />,
    },

    {
      name: "Reports & Analytics",
      path: "/super-admin/reports",
      icon: <FaChartBar />,
    },

    {
      name: "Audit Logs",
      path: "/super-admin/audit-logs",
      icon: <FaHistory />,
    },

    {
      name: "System Settings",
      path: "/super-admin/settings",
      icon: <FaCog />,
    },

    {
      name: "Security & Sessions",
      path: "/super-admin/security-sessions",
      icon: <FaLock />,
    },

    {
      name: "Backup & Database",
      path: "/super-admin/backup",
      icon: <FaDatabase />,
    },

    {
      name: "Integrations",
      path: "/super-admin/integrations",
      icon: <FaPlug />,
    },

    // =====================================================
    // LIVE LOCATION
    // =====================================================

    {
      name: "Live Location",
      path: "/super-admin/live-location",
      icon: <FaMapMarkerAlt />,
    },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#111111",
        color: "#FFFFFF",
        flexShrink: 0,
      }}
    >
      {/* ================================================= */}
      {/* LOGO */}
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
          Super Admin Panel
        </small>
      </div>

      {/* ================================================= */}
      {/* MENU */}
      {/* ================================================= */}

      <div
        className="p-3"
        style={{
          maxHeight: "calc(100vh - 100px)",
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

export default SuperAdminSidebar;

