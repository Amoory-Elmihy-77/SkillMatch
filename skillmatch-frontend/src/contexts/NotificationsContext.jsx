import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
// import { useSocket } from "./SocketContext";
import { useAuth } from "./AuthContext";
import api from "../services/api";
import toast from "react-hot-toast";

const NotificationsContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationsProvider"
    );
  }
  return context;
};

export const NotificationsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  // const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user?._id) return;

    console.log("Fetching notifications for user:", user._id);
    setLoading(true);
    try {
      const response = await api.get(`/notifications?limit=5`);
      console.log("Notifications API response:", response.data);
      const fetchedNotifications =
        response.data.data?.notifications || response.data.notifications || [];
      console.log("Fetched notifications:", fetchedNotifications);
      setNotifications(fetchedNotifications);

      const unread = fetchedNotifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?._id]);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      fetchNotifications();
    } else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, user?._id, fetchNotifications]);

  useEffect(() => {
    const handleNewNotification = (event) => {
      const notification = event.detail;

      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);
    };

    window.addEventListener("socket:new_notification", handleNewNotification);

    return () => {
      window.removeEventListener(
        "socket:new_notification",
        handleNewNotification
      );
    };
  }, []);

  const markAsRead = useCallback(async (notificationId) => {
    try {
      await api.post(`/notifications/${notificationId}/read`);

      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to update notification");
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    try {
      await api.post(`/notifications/read-all`);

      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

      setUnreadCount(0);
      toast.success("All notifications marked as read");
    } catch (error) {
      console.error("Failed to mark all as read:", error);
      toast.error("Failed to update notifications");
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const addNotification = useCallback((notification) => {
    setNotifications((prev) => [notification, ...prev]);
    if (!notification.isRead) {
      setUnreadCount((prev) => prev + 1);
    }
  }, []);

  const removeNotification = useCallback((notificationId) => {
    setNotifications((prev) => prev.filter((n) => n._id !== notificationId));
    setUnreadCount((prev) => Math.max(0, prev - 1));
  }, []);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    addNotification,
    removeNotification,
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};
