import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaBalanceScale,
  FaCalendarAlt,
  FaCreditCard,
  FaHeadset,
  FaUser,
  FaSignOutAlt
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="sidebar text-white p-3" style={{ width: "260px", minHeight: "100vh" }}>
      <h2 className="text-center mb-4 fw-bold text-warning">
        Amara Lands
      </h2>

      <ul className="nav flex-column">

        <li className="nav-item mb-2">
          <NavLink to="/dashboard" className="nav-link">
            <FaHome className="me-2" />
            Dashboard
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/properties" className="nav-link">
            <FaBuilding className="me-2" />
            Properties
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/legal" className="nav-link">
            <FaBalanceScale className="me-2" />
            Legal
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/appointments" className="nav-link">
            <FaCalendarAlt className="me-2" />
            Appointments
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/payments" className="nav-link">
            <FaCreditCard className="me-2" />
            Payments
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/support" className="nav-link">
            <FaHeadset className="me-2" />
            Support
          </NavLink>
        </li>

        <li className="nav-item mb-2">
          <NavLink to="/profile" className="nav-link">
            <FaUser className="me-2" />
            Profile
          </NavLink>
        </li>

      </ul>

      <button className="btn btn-primary w-100 mt-5">
        <FaSignOutAlt className="me-2" />
        Logout
      </button>
    </div>
  );
}