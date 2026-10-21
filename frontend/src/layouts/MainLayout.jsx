import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";

import NotificationDropdown from "../components/NotificationDropdown";
import socket from "../services/socketService";
import { fetchNotifications } from "../redux/notificationSlice";

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
  FaTimes,
} from "react-icons/fa";

export default function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { notifications = [] } = useSelector(
    (state) => state.notifications
  );

  const [openNotifications, setOpenNotifications] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const notificationRef = useRef(null);

  // Read the logged-in user safely.
  const getStoredUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  };

  const user = getStoredUser();

  // Amara Lands theme colors.
  const GOLD = "#D4AF37";
  const BLACK = "#0B0B0B";
  const WHITE = "#FFFFFF";

  // Sidebar menu.
  const menuItems = [
    { path: "/dashboard", name: "Dashboard", icon: FaHome },
    { path: "/properties", name: "Properties", icon: FaBuilding },
    { path: "/legal", name: "Legal", icon: FaBalanceScale },
    { path: "/appointments", name: "Appointments", icon: FaCalendarAlt },
    { path: "/payments", name: "Payments", icon: FaCreditCard },
    {
      path: "/security-monitoring",
      name: "Security Monitoring",
      icon: FaShieldAlt,
    },
    { path: "/notifications", name: "Notifications", icon: FaBell },
    { path: "/support", name: "Support", icon: FaHeadset },
    { path: "/profile", name: "Profile", icon: FaUser },
  ];

  // Dynamic page title.
  const pageTitles = {
    "/dashboard": "Dashboard",
    "/properties": "My Properties",
    "/legal": "Legal Services",
    "/appointments": "Appointments",
    "/payments": "Payment Management",
    "/payments/history": "Payment History",
    "/security-monitoring": "Security Monitoring",
    "/notifications": "Notifications",
    "/support": "Customer Support",
    "/profile": "My Profile",
  };

  const currentPage =
    pageTitles[location.pathname] ||
    [...menuItems]
      .sort((a, b) => b.path.length - a.path.length)
      .find(
        (item) =>
          location.pathname.startsWith(`${item.path}/`)
      )?.name ||
    "Customer Portal";

  // =====================================================
  // NOTIFICATIONS + SOCKET.IO
  // =====================================================

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    dispatch(fetchNotifications());

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinUserRoom", user.id);

    const handleNewNotification = () => {
      dispatch(fetchNotifications());
    };

    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [dispatch, user?.id]);

  // =====================================================
  // CLOSE NOTIFICATION DROPDOWN WHEN CLICKING OUTSIDE
  // =====================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setOpenNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close the mobile sidebar when the route changes.
  useEffect(() => {
    setMobileSidebarOpen(false);
    setOpenNotifications(false);
  }, [location.pathname]);

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (!confirmed) return;

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    if (socket.connected) {
      socket.disconnect();
    }

    navigate("/login", { replace: true });
  };

  // =====================================================
  // UNREAD NOTIFICATIONS
  // =====================================================

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div
      className="d-flex"
      style={{
        minHeight: "100vh",
        background: "#F7F7F5",
      }}
    >
      {/* MOBILE SIDEBAR BACKDROP */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            zIndex: 1040,
          }}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className="d-flex flex-column text-white"
        style={{
          width: "260px",
          minWidth: "260px",
          minHeight: "100vh",
          background: BLACK,
          borderRight: `3px solid ${GOLD}`,
          padding: "22px 15px",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
          zIndex: 1045,
        }}
      >
        {/* BRAND */}
        <div
          className="d-flex justify-content-between align-items-center px-2 pb-4 mb-3"
          style={{ borderBottom: "1px solid #333333" }}
        >
          <div>
            <h3
              className="fw-bold mb-1"
              style={{
                color: GOLD,
                letterSpacing: "1px",
                fontSize: "22px",
              }}
            >
              AMARA LANDS
            </h3>

            <small style={{ color: "#BDBDBD" }}>
              Customer Portal
            </small>
          </div>

          <button
            type="button"
            className="btn btn-sm d-lg-none text-white"
            onClick={() => setMobileSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <FaTimes />
          </button>
        </div>

        <div
          className="small text-uppercase fw-semibold px-3 mb-3"
          style={{
            color: "#999999",
            letterSpacing: "1.5px",
          }}
        >
          Main Menu
        </div>

        {/* NAVIGATION */}
        <nav className="nav flex-column gap-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/dashboard"}
                className="nav-link d-flex align-items-center gap-3"
                style={({ isActive }) => ({
                  color: isActive ? BLACK : "#E7E7E7",
                  background: isActive ? GOLD : "transparent",
                  borderRadius: "9px",
                  padding: "12px 14px",
                  fontWeight: isActive ? 700 : 500,
                  textDecoration: "none",
                  transition: "background 0.2s ease",
                })}
              >
                <Icon size={17} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* SIDEBAR FOOTER */}
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
              background: GOLD,
              color: BLACK,
              border: `1px solid ${GOLD}`,
              borderRadius: "9px",
              padding: "11px",
            }}
          >
            <FaSignOutAlt className="me-2" />
            Logout
          </button>

          <p
            className="text-center small mt-3 mb-0"
            style={{ color: "#888888" }}
          >
            © 2026 Amara Lands
          </p>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div
        className="flex-grow-1 d-flex flex-column"
        style={{ minWidth: 0 }}
      >
        {/* TOP NAVBAR */}
        <header
          className="d-flex justify-content-between align-items-center flex-wrap gap-3"
          style={{
            background: WHITE,
            borderBottom: `3px solid ${GOLD}`,
            padding: "15px 24px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.05)",
            position: "sticky",
            top: 0,
            zIndex: 1030,
          }}
        >
          <div className="d-flex align-items-center gap-3">
            <button
              type="button"
              className="btn btn-outline-dark d-lg-none"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <span className="fw-bold">☰</span>
            </button>

            <div>
              <h4
                className="fw-bold mb-1"
                style={{ color: BLACK }}
              >
                {currentPage}
              </h4>

              <small className="text-muted">
                Welcome to your Amara Lands account
              </small>
            </div>
          </div>

          <div className="d-flex align-items-center gap-3">
            {/* NOTIFICATION BELL */}
            <div className="position-relative" ref={notificationRef}>
              <button
                type="button"
                className="btn position-relative"
                style={{
                  background: "#FFF9E8",
                  color: BLACK,
                  border: "1px solid #E8DCA9",
                  borderRadius: "10px",
                  padding: "10px 13px",
                }}
                aria-label={`Notifications${
                  unreadCount ? `, ${unreadCount} unread` : ""
                }`}
                aria-expanded={openNotifications}
                onClick={() =>
                  setOpenNotifications((previous) => !previous)
                }
              >
                <FaBell size={19} />

                {unreadCount > 0 && (
                  <span
                    className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                    style={{ fontSize: "10px" }}
                  >
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </button>

              <NotificationDropdown
                notifications={notifications}
                open={openNotifications}
                setOpen={setOpenNotifications}
              />
            </div>

            {/* USER */}
            <div className="d-flex align-items-center gap-2">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center"
                style={{
                  width: "40px",
                  height: "40px",
                  background: "#FFF4CC",
                  color: "#8B6B0B",
                  border: `1px solid ${GOLD}`,
                  fontWeight: 700,
                }}
              >
                {String(user.full_name || "U")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="d-none d-sm-block">
                <div
                  className="fw-semibold"
                  style={{ color: BLACK }}
                >
                  {user.full_name || "User"}
                </div>

                <small className="text-muted">
                  Customer
                </small>
              </div>
            </div>

          
          </div>
        </header>

        {/* ROUTED PAGE CONTENT */}
        <main
          className="flex-grow-1"
          style={{
            padding: "24px",
            background: "#F7F7F5",
          }}
        >
          <Outlet />
        </main>

        {/* FOOTER */}
        <footer
          className="text-center"
          style={{
            background: WHITE,
            borderTop: `2px solid ${GOLD}`,
            padding: "17px 12px",
            color: "#555555",
          }}
        >
          <div
            className="fw-bold mb-1"
            style={{ color: BLACK, letterSpacing: "1px" }}
          >
            AMARA LANDS
          </div>

          <small>
            © {new Date().getFullYear()} Amara Lands. All Rights Reserved.
          </small>
        </footer>
      </div>

      {/* RESPONSIVE SIDEBAR RULES */}
      <style>{`
        @media (max-width: 991.98px) {
          aside.sidebar,
          .customer-sidebar {
            width: 260px;
          }
        }

        @media (max-width: 991.98px) {
          body:has(.customer-mobile-sidebar) {
            overflow-x: hidden;
          }
        }

        @media (max-width: 575.98px) {
          main {
            padding: 14px !important;
          }
        }
      `}</style>
    </div>
  );
}