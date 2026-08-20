import api from "./api";

// Get all notifications
export const getNotifications = () =>
  api.get("/notifications");

// Mark one notification as read
export const markAsRead = (id) =>
  api.put(`/notifications/${id}/read`);

// Mark all notifications as read
export const markAllAsRead = () =>
  api.put("/notifications/read-all");

// Delete one notification
export const deleteNotification = (id) =>
  api.delete(`/notifications/${id}`);