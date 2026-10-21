
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaHome,
  FaBuilding,
  FaBalanceScale,
  FaCalendarAlt,
  FaCreditCard,
  FaHeadset,
  FaUser,
  FaSignOutAlt,
  FaShieldAlt,
  FaTimes,
} from "react-icons/fa";

export default function Sidebar({ onClose }) {
  const navigate = useNavigate();

  const menuItems = [
    { to: "/dashboard", label: "Dashboard", icon: FaHome },
    { to: "/properties", label: "Properties", icon: FaBuilding },
    { to: "/legal", label: "Legal", icon: FaBalanceScale },
    { to: "/appointments", label: "Appointments", icon: FaCalendarAlt },
    { to: "/payments", label: "Payments", icon: FaCreditCard },
    {
      to: "/security-reports",
      label: "Security Monitoring",
      icon: FaShieldAlt,
    },
    { to: "/support", label: "Support", icon: FaHeadset },
    { to: "/profile", label: "Profile", icon: FaUser },
  ];

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    // Clear the usual authentication keys.
    // Adjust these names if your existing login flow uses different keys.
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");

    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");

    navigate("/login", { replace: true });
  };

  return (
    <aside
      className="d-flex flex-column text-white"
      style={{
        width: "260px",
        minHeight: "100vh",
        background: "#0B0B0B",
        borderRight: "3px solid #D4AF37",
        padding: "22px 16px",
        flexShrink: 0,
      }}
    >
      <div className="d-flex justify-content-between align-items-center mb-4 px-2">
        <div>
          <h3
            className="fw-bold mb-1"
            style={{ color: "#D4AF37", letterSpacing: "1px" }}
          >
            AMARA LANDS
          </h3>
          <small style={{ color: "#BDBDBD" }}>Customer Portal</small>
        </div>

        {onClose && (
          <button
            type="button"
            className="btn btn-sm btn-outline-light"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        )}
      </div>

      <div
        className="small text-uppercase fw-semibold px-3 mb-3"
        style={{ color: "#A8A8A8", letterSpacing: "1.5px" }}
      >
        Main Menu
      </div>

      <ul className="nav flex-column gap-2">
        {menuItems.map(({ to, label, icon: Icon }) => (
          <li className="nav-item" key={to}>
            <NavLink
              to={to}
              end={to === "/dashboard"}
              onClick={onClose}
              className="nav-link d-flex align-items-center"
              style={({ isActive }) => ({
                color: isActive ? "#111111" : "#E7E7E7",
                background: isActive ? "#D4AF37" : "transparent",
                borderRadius: "9px",
                padding: "12px 14px",
                fontWeight: isActive ? 700 : 500,
                transition: "all 0.2s ease",
                textDecoration: "none",
              })}
            >
              <Icon className="me-3" size={17} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-4">
        <div
          className="mb-3"
          style={{ borderTop: "1px solid #333333" }}
        />

        <button
          type="button"
          className="btn w-100 fw-semibold"
          onClick={handleLogout}
          style={{
            background: "#D4AF37",
            color: "#111111",
            border: "1px solid #D4AF37",
            borderRadius: "9px",
            padding: "11px",
          }}
        >
          <FaSignOutAlt className="me-2" />
          Logout
        </button>

        <p className="text-center small mt-3 mb-0" style={{ color: "#888888" }}>
          © 2026 Amara Lands
        </p>
      </div>
    </aside>
  );
}
