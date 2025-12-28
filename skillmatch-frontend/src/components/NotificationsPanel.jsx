import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  Check,
  UserPlus,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useNotifications } from "../contexts/NotificationsContext";
import api from "../services/api";
import toast from "react-hot-toast";
import { getUserAvatarUrl } from "../utils/avatar";

const NotificationsPanel = () => {
  const { notifications, unreadCount, markAsRead, removeNotification } =
    useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [processing, setProcessing] = useState({});
  const panelRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAcceptConnection = async (notification) => {
    const connectionId =
      notification.referenceId ||
      notification.connectionId ||
      notification.relatedId;

    if (!connectionId) {
      console.error(
        "ERROR: Connection ID is missing in notification:",
        notification
      );
      toast.error("Cannot accept connection: Missing connection ID");
      return;
    }

    setProcessing((prev) => ({ ...prev, [notification._id]: true }));
    try {
      await api.post(`/connections/${connectionId}/accept`);
      toast.success("Connection request accepted!");
      await markAsRead(notification._id);
      removeNotification(notification._id);
    } catch (error) {
      console.error("Failed to accept connection:", error);
      toast.error("Failed to accept connection request");
    } finally {
      setProcessing((prev) => ({ ...prev, [notification._id]: false }));
    }
  };

  const handleRejectConnection = async (notification) => {
    const connectionId =
      notification.referenceId ||
      notification.connectionId ||
      notification.relatedId;

    if (!connectionId) {
      console.error(
        "ERROR: Connection ID is missing in notification:",
        notification
      );
      toast.error("Cannot reject connection: Missing connection ID");
      return;
    }

    setProcessing((prev) => ({ ...prev, [notification._id]: true }));
    try {
      await api.post(`/connections/${connectionId}/reject`);
      toast.success("Connection request rejected");
      await markAsRead(notification._id);
      removeNotification(notification._id);
    } catch (error) {
      console.error("Failed to reject connection:", error);
      toast.error("Failed to reject connection request");
    } finally {
      setProcessing((prev) => ({ ...prev, [notification._id]: false }));
    }
  };

  const handleNotificationClick = (notification) => {
    if (notification.type !== "connection_request" && !notification.isRead) {
      markAsRead(notification._id);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case "connection_request":
        return <UserPlus className="w-5 h-5 text-blue-600" />;
      case "connection_accepted":
        return <Check className="w-5 h-5 text-green-600" />;
      case "job_share":
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case "job_application":
        return <Briefcase className="w-5 h-5 text-blue-600" />;
      case "message":
        return <MessageSquare className="w-5 h-5 text-orange-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getDisplayName = (notification) => {
    return (
      notification.actor?.name ||
      notification.actor?.username ||
      notification.sender?.name ||
      notification.sender?.username ||
      "Someone"
    );
  };

  const renderNotificationContent = (notification) => {
    const isProcessingThis = processing[notification._id];

    switch (notification.type) {
      case "connection_request":
        return (
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              {(notification.actor?.photo || notification.sender?.photo) && (
                <img
                  src={getUserAvatarUrl(
                    notification.actor || notification.sender
                  )}
                  alt={getDisplayName(notification)}
                  className="w-10 h-10 rounded-full object-cover"
                />
              )}
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  <span className="font-semibold">
                    {getDisplayName(notification)}
                  </span>{" "}
                  sent you a connection request
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(notification.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
            {!notification.actionTaken && !notification.isRead ? (
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAcceptConnection(notification);
                  }}
                  disabled={isProcessingThis}
                  className="flex-1 px-3 py-1.5 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejectConnection(notification);
                  }}
                  disabled={isProcessingThis}
                  className="flex-1 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            ) : (
              <div className="mt-2 text-sm text-green-600 font-medium flex items-center gap-1">
                <Check className="w-4 h-4" />
                You are now friends
              </div>
            )}
          </div>
        );

      case "connection_accepted":
        return (
          <div className="flex items-start gap-3">
            {(notification.actor?.photo || notification.sender?.photo) && (
              <img
                src={getUserAvatarUrl(
                  notification.actor || notification.sender
                )}
                alt={getDisplayName(notification)}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm text-gray-900">
                <span className="font-semibold">
                  {getDisplayName(notification)}
                </span>{" "}
                accepted your connection request
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        );

      case "job_application":
        return (
          <div className="flex items-start gap-3">
            {(notification.actor?.photo || notification.sender?.photo) && (
              <img
                src={getUserAvatarUrl(
                  notification.actor || notification.sender
                )}
                alt={getDisplayName(notification)}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div>
              <p className="text-sm text-gray-900">
                {notification.message || (
                  <>
                    <span className="font-semibold">
                      {getDisplayName(notification)}
                    </span>{" "}
                    {notification.type === "job_application" &&
                    notification.status
                      ? `application status: ${notification.status}`
                      : "sent you a job application notification"}
                  </>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(notification.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-sm text-gray-900">{notification.message}</p>
            <p className="text-xs text-gray-500 mt-1">
              {new Date(notification.createdAt).toLocaleDateString()}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Notifications
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.isRead ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        {renderNotificationContent(notification)}
                      </div>
                      {!notification.isRead && (
                        <div className="flex-shrink-0">
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200">
              <Link
                to="/connections"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View All Connections
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPanel;
