import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchNotifications,
  readNotification,
  removeNotification,
} from "../../redux/notificationSlice";

export default function NotificationList() {
  const dispatch = useDispatch();

  const { notifications, loading } = useSelector(
    (state) => state.notifications
  );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleRead = (id) => {
    dispatch(readNotification(id));
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this notification?")) {
      dispatch(removeNotification(id));
    }
  };

  if (loading) {
    return <h5 className="text-center mt-5">Loading...</h5>;
  }

  return (
    <div className="container mt-4">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3>Notifications</h3>
        </div>

        <div className="card-body">

          {notifications.length === 0 ? (
            <div className="alert alert-info">
              No Notifications Found
            </div>
          ) : (
            <table className="table table-bordered table-hover">

              <thead>

                <tr>
                  <th>Title</th>
                  <th>Message</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>

              </thead>

              <tbody>

                {notifications.map((notification) => (

                  <tr key={notification.id}>

                    <td>{notification.title}</td>

                    <td>{notification.message}</td>

                    <td>{notification.notification_type}</td>

                    <td>

                      {notification.is_read ? (
                        <span className="badge bg-success">
                          Read
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          Unread
                        </span>
                      )}

                    </td>

                    <td>
                      {new Date(
                        notification.created_at
                      ).toLocaleString()}
                    </td>

                    <td>

                      {!notification.is_read && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            handleRead(notification.id)
                          }
                        >
                          Mark Read
                        </button>
                      )}

                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() =>
                          handleDelete(notification.id)
                        }
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

    </div>
  );
}