
import { NavLink } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBuilding,
  FaMoneyCheckAlt,
  FaChartBar,
  FaBalanceScale,
  FaShieldAlt,
  FaUserTie,
  FaCog,
  FaSignOutAlt,
  FaUndo,
  FaFileInvoice,
  FaUserCircle,
} from "react-icons/fa";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `nav-link ${isActive ? "active bg-warning text-dark fw-bold" : "text-white"}`;

  return (
    <div
      className="bg-dark text-white"
      style={{ width: "260px", minHeight: "100vh" }}
    >
      <div className="p-4 border-bottom">
        <h4 className="fw-bold text-center">Amara Lands</h4>
        <small className="text-secondary">Admin Panel</small>
      </div>

      <ul className="nav flex-column p-2">
        <li className="nav-item">
          <NavLink to="/admin/dashboard" className={linkClass}>
            <FaTachometerAlt className="me-2" /> Dashboard
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/users" className={linkClass}>
            <FaUsers className="me-2" /> User Management
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/properties" className={linkClass}>
            <FaBuilding className="me-2" /> Property Verification
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/payments" className={linkClass}>
            <FaMoneyCheckAlt className="me-2" /> Payment Management
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/invoices" className={linkClass}>
            <FaFileInvoice className="me-2" /> Invoice Management
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/refunds" className={linkClass}>
            <FaUndo className="me-2" /> Refund Management
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/analytics" className={linkClass}>
            <FaChartBar className="me-2" /> Analytics
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/legal" className={linkClass}>
            <FaBalanceScale className="me-2" /> Legal Management
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/security" className={linkClass}>
            <FaShieldAlt className="me-2" /> Security Monitoring
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/staff" className={linkClass}>
            <FaUserTie className="me-2" /> Staff Assignment
          </NavLink>
        </li>

        <li className="nav-item">
          <NavLink to="/admin/settings" className={linkClass}>
            <FaCog className="me-2" /> Settings
          </NavLink>
        </li>

        {/* Admin Profile */}
        <li className="nav-item">
          <NavLink to="/admin/profile" className={linkClass}>
            <FaUserCircle className="me-2" /> My Profile
          </NavLink>
        </li>

        <hr className="text-secondary" />

        <li className="nav-item">
          <NavLink to="/login" className="nav-link text-danger">
            <FaSignOutAlt className="me-2" /> Logout
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
