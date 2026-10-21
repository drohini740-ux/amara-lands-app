
import { useLocation } from "react-router-dom";
import {
  FaBars,
  FaBell,
  FaUserCircle,
} from "react-icons/fa";

export default function Navbar({ onMenuClick }) {
  const location = useLocation();

  const pageNames = {
    "/dashboard": "Dashboard",
    "/properties": "My Properties",
    "/legal": "Legal Services",
    "/appointments": "Appointments",
    "/payments": "Payment Management",
    "/payments/history": "Payment History",
    "/security-reports": "Security Monitoring",
    "/support": "Customer Support",
    "/profile": "My Profile",
  };

  const currentPage =
    pageNames[location.pathname] || "Customer Portal";

  return (
    <header
      className="d-flex justify-content-between align-items-center flex-wrap gap-3"
      style={{
        background: "#FFFFFF",
        borderBottom: "3px solid #D4AF37",
        padding: "15px 24px",
        boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
      }}
    >
      <div className="d-flex align-items-center gap-3">
        {onMenuClick && (
          <button
            type="button"
            className="btn btn-outline-dark"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <FaBars />
          </button>
        )}

        <div>
          <h4 className="mb-1 fw-bold" style={{ color: "#111111" }}>
            {currentPage}
          </h4>
          <small className="text-muted">
            Welcome to your Amara Lands account
          </small>
        </div>
      </div>

      <div className="d-flex align-items-center gap-3">
        <div
          className="d-none d-md-block text-end"
          style={{ lineHeight: 1.3 }}
        >
          <div className="fw-semibold" style={{ color: "#111111" }}>
            Customer Portal
          </div>
          <small style={{ color: "#9B7B16" }}>Premium Experience</small>
        </div>

        <div
          className="rounded-circle d-flex align-items-center justify-content-center"
          style={{
            width: "42px",
            height: "42px",
            background: "#FFF4CC",
            color: "#8B6B0B",
            border: "1px solid #D4AF37",
          }}
          title="Customer profile"
        >
          <FaUserCircle size={23} />
        </div>
      </div>
    </header>
  );
}
