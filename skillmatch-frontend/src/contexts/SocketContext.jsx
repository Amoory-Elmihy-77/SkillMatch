import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user?._id) {
      if (socketRef.current) {
        console.log("Disconnecting socket - user not authenticated");
        socketRef.current.disconnect();
        socketRef.current = null;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";

    console.log("Establishing socket connection for user:", user._id);

    const newSocket = io(SOCKET_URL, {
      query: { userId: user._id },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    newSocket.on("new_notification", (data) => {
      console.log("Received new notification:", data);

      const notification = data.notification || data;
      const message =
        data.message || notification.message || "New notification received";

      toast.success(message, {
        duration: 4000,
        position: "top-right",
      });

      window.dispatchEvent(
        new CustomEvent("socket:new_notification", {
          detail: notification,
        })
      );
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    return () => {
      console.log("Cleaning up socket connection");
      if (socketRef.current) {
        socketRef.current.off("connect");
        socketRef.current.off("disconnect");
        socketRef.current.off("connect_error");
        socketRef.current.off("new_notification");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      setSocket(null);
      setIsConnected(false);
    };
  }, [isAuthenticated, user?._id]);

  const value = {
    socket,
    isConnected,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};
