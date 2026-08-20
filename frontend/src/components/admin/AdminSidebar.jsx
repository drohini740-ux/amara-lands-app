import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyCheckAlt,
  FaChartBar,
  FaClipboardList,
  FaBalanceScale,
  FaShieldAlt,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaUndo,
} from "react-icons/fa";

export default function AdminSidebar() {
  return (
    <div
      className="bg-dark text-white"
      style={{
        width: "260px",
        minHeight: "100vh",
      }}
    >
      {/* =========================
          HEADER
      ========================= */}
      <div className="p-4 border-bottom">
        <h4 className="fw-bold text-center">
          Amara Lands
        </h4>

        <small className="text-secondary">
          Admin Panel
        </small>
      </div>

      {/* =========================
          MENU
      ========================= */}
      <ul className="nav flex-column p-2">

        {/* Dashboard */}
        <li className="nav-item">
          <NavLink
            to="/admin/dashboard"
            className="nav-link text-white"
          >
            <FaTachometerAlt className="me-2" />
            Dashboard
          </NavLink>
        </li>

        {/* User Management */}
        <li className="nav-item">
          <NavLink
            to="/admin/users"
            className="nav-link text-white"
          >
            <FaUsers className="me-2" />
            User Management
          </NavLink>
        </li>

        {/* Property Verification */}
        <li className="nav-item">
          <NavLink
            to="/admin/properties"
            className="nav-link text-white"
          >
            <FaBuilding className="me-2" />
            Property Verification
          </NavLink>
        </li>

        {/* Payment Management */}
        <li className="nav-item">
          <NavLink
            to="/admin/payments"
            className="nav-link text-white"
          >
            <FaMoneyCheckAlt className="me-2" />
            Payment Management
          </NavLink>
        </li>

        {/* Refund Management */}
        <li className="nav-item">
          <NavLink
            to="/admin/refunds"
            className="nav-link text-white"
          >
            <FaUndo className="me-2" />
            Refund Management
          </NavLink>
        </li>

        {/* Revenue Reports */}
        <li className="nav-item">
          <NavLink
            to="/admin/reports"
            className="nav-link text-white"
          >
            <FaClipboardList className="me-2" />
            Revenue Reports
          </NavLink>
        </li>

        {/* Analytics */}
        <li className="nav-item">
          <NavLink
            to="/admin/analytics"
            className="nav-link text-white"
          >
            <FaChartBar className="me-2" />
            Analytics
          </NavLink>
        </li>

        {/* Legal Management */}
        <li className="nav-item">
          <NavLink
            to="/admin/legal"
            className="nav-link text-white"
          >
            <FaBalanceScale className="me-2" />
            Legal Management
          </NavLink>
        </li>

        {/* Security Monitoring */}
        <li className="nav-item">
          <NavLink
            to="/admin/security"
            className="nav-link text-white"
          >
            <FaShieldAlt className="me-2" />
            Security Monitoring
          </NavLink>
        </li>

        {/* Staff Assignment */}
        <li className="nav-item">
          <NavLink
            to="/admin/staff"
            className="nav-link text-white"
          >
            <FaUserTie className="me-2" />
            Staff Assignment
          </NavLink>
        </li>

        {/* Settings */}
        <li className="nav-item">
          <NavLink
            to="/admin/settings"
            className="nav-link text-white"
          >
            <FaCog className="me-2" />
            Settings
          </NavLink>
        </li>

        <hr className="text-secondary" />

        {/* Logout */}
        <li className="nav-item">
          <NavLink
            to="/login"
            className="nav-link text-danger"
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </NavLink>
        </li>

      </ul>
    </div>
  );
}