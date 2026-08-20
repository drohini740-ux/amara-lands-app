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
  FaShieldAlt,
} from "react-icons/fa";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { fetchNotifications } from "../redux/notificationSlice";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications } = useSelector(
    (state) => state.notifications
  );

  const [openNotifications, setOpenNotifications] = useState(false);

  const user = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  // =========================================================
  // NOTIFICATION + SOCKET.IO
  // =========================================================

  useEffect(() => {
    if (!user?.id) {
      console.log("❌ No logged-in user found");
      return;
    }

    console.log("👤 Logged-in user:", user);
    console.log("🔌 User ID:", user.id);

    // Fetch existing notifications
    dispatch(fetchNotifications());

    // Make sure socket is connected
    if (!socket.connected) {
      console.log("🔌 Connecting Socket.IO...");
      socket.connect();
    }

    // Join user-specific notification room
    console.log(
      "🏠 Joining notification room:",
      `user_${user.id}`
    );

    socket.emit("joinUserRoom", user.id);

    // =======================================================
    // REAL-TIME NOTIFICATION
    // =======================================================

    const handleNewNotification = (notification) => {
      console.log(
        "🔔 REAL-TIME NOTIFICATION RECEIVED:",
        notification
      );

      // Refresh notifications immediately
      dispatch(fetchNotifications());
    };

    socket.on(
      "newNotification",
      handleNewNotification
    );

    // =======================================================
    // CLEANUP
    // =======================================================

    return () => {
      console.log(
        "🧹 Removing notification socket listener"
      );

      socket.off(
        "newNotification",
        handleNewNotification
      );
    };
  }, [dispatch, user?.id]);

  // =========================================================
  // CLOSE NOTIFICATION DROPDOWN WHEN CLICKING OUTSIDE
  // =========================================================

  useEffect(() => {
    const handleClickOutside = () => {
      setOpenNotifications(false);
    };

    document.addEventListener(
      "click",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "click",
        handleClickOutside
      );
    };
  }, []);

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    console.log("🚪 Logging out...");

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Disconnect socket
    if (socket.connected) {
      socket.disconnect();
    }

    navigate("/login");
  };

  // =========================================================
  // MENU ITEMS
  // =========================================================

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
      path: "/security-monitoring",
      name: "Security Monitoring",
      icon: <FaShieldAlt />,
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

  // =========================================================
  // UNREAD COUNT
  // =========================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="d-flex">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <div
        className="sidebar shadow"
        style={{
          width: "250px",
          minHeight: "100vh",
        }}
      >
        <div className="p-4 border-bottom">
          <h2 className="fw-bold mb-0 text-warning">
            Amara Lands
          </h2>
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
              <span
                style={{
                  fontSize: "18px",
                }}
              >
                {item.icon}
              </span>

              <span>{item.name}</span>
            </Link>
          ))}

        </nav>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div className="flex-grow-1 bg-light">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div
          className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center"
        >
          <h3 className="mb-0 fw-bold">
            Dashboard
          </h3>

          <div className="d-flex align-items-center">

            {/* =================================================
                NOTIFICATION BELL
            ================================================= */}

            <div className="position-relative me-4">

              <button
                className="btn border-0 bg-transparent position-relative"
                onClick={(e) => {
                  e.stopPropagation();

                  setOpenNotifications(
                    (prev) => !prev
                  );
                }}
              >
                <FaBell size={22} />

                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                  >
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

            {/* =================================================
                USER NAME
            ================================================= */}

            <span className="me-3 fw-semibold">
              {user.full_name || "User"}
            </span>

            {/* =================================================
                LOGOUT
            ================================================= */}

            <button
              className="btn btn-danger btn-sm d-flex align-items-center"
              onClick={handleLogout}
            >
              <FaSignOutAlt className="me-2" />
              Logout
            </button>

          </div>
        </div>

        {/* ===================================================
            PAGE CONTENT
        =================================================== */}

        <div className="p-4">
          <Outlet />
        </div>

      </div>
    </div>
  );
}