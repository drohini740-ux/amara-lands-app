import { Link } from "react-router-dom";

export default function NotificationDropdown({
  notifications,
  open,
  setOpen,
}) {
  if (!open) return null;

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
      <div className="card-header fw-bold bg-warning text-white">
        Notifications
      </div>

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
              className="border-bottom p-3"
            >
              <strong>{notification.title}</strong>

              <div className="small text-muted mt-1">
                {notification.message}
              </div>

              <small className="text-secondary">
                {new Date(notification.created_at).toLocaleString()}
              </small>
            </div>
          ))
        )}
      </div>

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