import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaBuilding,
  FaBalanceScale,
  FaCalendarAlt,
  FaCreditCard,
  FaHeadset,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove stored authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to Login page
    navigate("/login");
  };

  const menuItems = [
    {
      path: "/dashboard",
      name: "Dashboard",
      icon: <FaHome />,
    },
    {
      path: "/properties",
      name: "Properties",
      icon: <FaBuilding />,
    },
    {
      path: "/legal",
      name: "Legal",
      icon: <FaBalanceScale />,
    },
    {
      path: "/appointments",
      name: "Appointments",
      icon: <FaCalendarAlt />,
    },
    {
      path: "/payments",
      name: "Payments",
      icon: <FaCreditCard />,
    },
    {
      path: "/support",
      name: "Support",
      icon: <FaHeadset />,
    },
    {
      path: "/profile",
      name: "Profile",
      icon: <FaUser />,
    },
  ];

  return (
    <div className="d-flex">

      {/* Sidebar */}
      <div
        className="sidebar shadow"
        style={{
          width: "250px",
          minHeight: "100vh",
        }}
      >
        <div className="p-4 border-bottom">
          <h2 className="fw-bold mb-0 text-warning">Amara Lands</h2>
        </div>

        <nav className="nav flex-column p-3">

          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link d-flex align-items-center gap-3 rounded mb-2 ${
                location.pathname === item.path
  ? "active-menu"
  : ""
              }`}
              style={{
                padding: "12px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "18px" }}>
                {item.icon}
              </span>

              <span>{item.name}</span>

            </Link>
          ))}

        </nav>

      </div>

      {/* Main Content */}

      <div className="flex-grow-1 bg-light">

        {/* Header */}

        <div className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">

          <h3 className="mb-0 fw-bold">
            Dashboard
          </h3>

          <div className="d-flex align-items-center">

            <span className="me-3 fw-semibold">
              Rohini
            </span>

            <button
              className="btn btn-danger btn-sm d-flex align-items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>

          </div>

        </div>

        {/* Page Content */}

        <div className="p-4">
          <Outlet />
        </div>

      </div>

    </div>
  );
}