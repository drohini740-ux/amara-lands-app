import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { readNotification } from "../redux/notificationSlice";

export default function NotificationDropdown({
  notifications,
  open,
  setOpen,
}) {
  const dispatch = useDispatch();

  if (!open) return null;

  // ===========================
  // Mark Notification as Read
  // ===========================
  const handleNotificationClick = (notification) => {
    if (!notification.is_read) {
      dispatch(readNotification(notification.id));
    }
  };

  return (
    <div
      className="card shadow position-absolute"
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "350px",
        right: "0",
        top: "45px",
        zIndex: 1000,
      }}
    >
      {/* Header */}
      <div className="card-header fw-bold bg-warning text-white d-flex justify-content-between align-items-center">
        <span>🔔 Notifications</span>
      </div>

      {/* Notification List */}
      <div
        className="card-body p-0"
        style={{
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        {notifications.length === 0 ? (
          <p className="text-center p-3 mb-0">
            No Notifications
          </p>
        ) : (
          notifications.slice(0, 5).map((notification) => (
            <div
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={`border-bottom p-3 ${
                !notification.is_read ? "bg-light" : ""
              }`}
              style={{
                cursor: "pointer",
              }}
            >
              <div className="d-flex justify-content-between align-items-start">
                <strong
                  className={
                    !notification.is_read
                      ? "fw-bold"
                      : "fw-normal"
                  }
                >
                  {notification.title}
                </strong>

                {/* Unread indicator */}
                {!notification.is_read && (
                  <span
                    className="badge bg-danger rounded-pill"
                    style={{ fontSize: "10px" }}
                  >
                    New
                  </span>
                )}
              </div>

              <div className="small text-muted mt-1">
                {notification.message}
              </div>

              <small className="text-secondary">
                {new Date(
                  notification.created_at
                ).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="card-footer text-center">
        <Link
          to="/notifications"
          onClick={() => setOpen(false)}
        >
          View All Notifications
        </Link>
      </div>
    </div>
  );
}