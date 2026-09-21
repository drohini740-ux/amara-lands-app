import React from "react";
import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaUserShield,
  FaUserCog,
  FaCog,
  FaHistory,
  FaChartBar,
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
      name: "Admin Management",
      path: "/super-admin/admins",
      icon: <FaUserShield />,
    },
    {
      name: "Roles & Permissions",
      path: "/super-admin/roles",
      icon: <FaUserCog />,
    },
    {
      name: "System Settings",
      path: "/super-admin/settings",
      icon: <FaCog />,
    },
    {
      name: "Audit Logs",
      path: "/super-admin/audit-logs",
      icon: <FaHistory />,
    },
    {
      name: "Reports",
      path: "/super-admin/reports",
      icon: <FaChartBar />,
    },
  ];

  return (
    <div
      style={{
        width: "260px",
        minHeight: "100vh",
        backgroundColor: "#111111",
        color: "#FFFFFF",
      }}
    >

      {/* LOGO */}
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

      {/* MENU */}
      <div className="p-3">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className="text-decoration-none d-flex align-items-center"
            style={({ isActive }) => ({
              color: isActive ? "#111111" : "#FFFFFF",
              backgroundColor: isActive
                ? "#C9A227"
                : "transparent",
              padding: "12px 15px",
              marginBottom: "6px",
              borderRadius: "6px",
              fontWeight: isActive ? "600" : "400",
              transition: "all 0.2s ease",
            })}
          >

            <span
              className="me-3"
              style={{
                fontSize: "17px",
              }}
            >
              {item.icon}
            </span>

            <span>
              {item.name}
            </span>

          </NavLink>

        ))}

      </div>

    </div>
  );
};

export default SuperAdminSidebar;