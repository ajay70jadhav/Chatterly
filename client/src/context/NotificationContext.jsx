import { createContext, useState, useRef, useEffect, useCallback } from "react";
import { AccountContext } from "./AccountProvider";

export const NotificationContext = createContext(null);

const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [browserPermission, setBrowserPermission] = useState("default");
  const audioRef = useRef(null);

  // Initialize audio for notification sound
  useEffect(() => {
    audioRef.current = new Audio("/notification-sound.mp3");
    audioRef.current.volume = 0.3; // Set volume to 30%

    // Check browser notification permission
    if ("Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      return permission === "granted";
    }
    return false;
  }, []);

  // Show browser notification
  const showBrowserNotification = useCallback(
    (data) => {
      if (browserPermission !== "granted") return;

      const { senderName, messagePreview, senderPicture } = data;

      new Notification(`New message from ${senderName}`, {
        body: messagePreview,
        icon: senderPicture || "/Images/Default-Avatar.jpg",
        badge: "/vite.svg",
        tag: data.chatId, // Prevent duplicate notifications
        requireInteraction: false,
      });
    },
    [browserPermission]
  );

  // Play notification sound
  const playNotificationSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        // Ignore autoplay policy errors
        console.log("Audio play failed - user interaction required");
      });
    }
  }, []);

  // Add new notification
  const addNotification = useCallback(
    (data) => {
      const notification = {
        id: Date.now() + Math.random(),
        ...data,
        timestamp: new Date(),
      };

      setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep only last 5 notifications

      // Update unread count for the chat
      setUnreadCounts((prev) => ({
        ...prev,
        [data.chatId]: (prev[data.chatId] || 0) + 1,
      }));

      // Play sound and show browser notification
      playNotificationSound();
      showBrowserNotification(data);

      // Auto-remove notification from queue after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 3000);
    },
    [playNotificationSound, showBrowserNotification]
  );

  // Mark chat as read
  const markChatAsRead = useCallback((chatId) => {
    setUnreadCounts((prev) => ({
      ...prev,
      [chatId]: 0,
    }));
  }, []);

  // Get unread count for specific chat
  const getUnreadCount = useCallback(
    (chatId) => {
      return unreadCounts[chatId] || 0;
    },
    [unreadCounts]
  );

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCounts({});
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCounts,
        browserPermission,
        addNotification,
        markChatAsRead,
        getUnreadCount,
        clearNotifications,
        requestNotificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
