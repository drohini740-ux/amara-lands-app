import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "../components/NotificationDropdown";
import socket from "../services/socketService";

import {
  FaHome,
  FaBuilding,
  FaBalanceScale,
  FaCalendarAlt,
  FaCreditCard,
  FaBell,
  FaHeadset,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { fetchNotifications } from "../redux/notificationSlice";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications } = useSelector((state) => state.notifications);
  const [openNotifications, setOpenNotifications] = useState(false);
  // Fetch notifications every 5 seconds
  useEffect(() => {
    dispatch(fetchNotifications());

    socket.on("newNotification", (notification) => {
      console.log("New Notification:", notification);

      dispatch(fetchNotifications());
    });

    return () => {
      socket.off("newNotification");
    };
  }, [dispatch]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenNotifications(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
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
      path: "/payment-dashboard",
      name: "Payment Dashboard",
      icon: <FaCreditCard />,
    },
    {
      path: "/notifications",
      name: "Notifications",
      icon: <FaBell />,
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
  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
                location.pathname === item.path ? "active-menu" : ""
              }`}
              style={{
                padding: "12px",
                textDecoration: "none",
              }}
            >
              <span style={{ fontSize: "18px" }}>{item.icon}</span>

              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}

      <div className="flex-grow-1 bg-light">
        {/* Header */}

        <div className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center">
          <h3 className="mb-0 fw-bold">Dashboard</h3>

          <div className="d-flex align-items-center">
            <div className="position-relative me-4">
              <button
                className="btn border-0 bg-transparent position-relative"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenNotifications((prev) => !prev);
                }}
              >
                <FaBell size={22} />

                {unreadCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {unreadCount}
                  </span>
                )}
              </button>
              <NotificationDropdown
                notifications={notifications}
                open={openNotifications}
                setOpen={setOpenNotifications}
              />
            </div>

            <span className="me-3 fw-semibold">Rohini</span>

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
