import { useContext, useState, useEffect, useRef } from "react";
import { useMediaQuery, useTheme } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";
import NotificationBanner from "./NotificationBanner";

const NotificationManager = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { markChatAsRead } = useContext(AccountContext);

  const [notifications, setNotifications] = useState([]);
  const [dismissedNotifications, setDismissedNotifications] = useState(new Set());
  const [browserPermission, setBrowserPermission] = useState("default");
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef(null);

  // Initialize audio and check browser permissions
  useEffect(() => {
    // Initialize notification sound
    audioRef.current = new Audio("/notification-sound.mp3");
    audioRef.current.volume = 0.3;
    setAudioInitialized(true);

    // Check browser notification permission
    if ("Notification" in window) {
      setBrowserPermission(Notification.permission);
    }
  }, []);

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      return permission === "granted";
    }
    return false;
  };

  // Show browser notification
  const showBrowserNotification = (data) => {
    if (browserPermission !== "granted") return;

    const { senderName, messagePreview, senderPicture } = data;

    const notification = new Notification(`New message from ${senderName}`, {
      body: messagePreview.length > 60 ? messagePreview.substring(0, 60) + "..." : messagePreview,
      icon: senderPicture || "/Images/Default-Avatar.jpg",
      badge: "/vite.svg",
      tag: data.chatId, // Prevent duplicate notifications
      requireInteraction: false,
      silent: true,
    });

    // Auto-close after 4 seconds
    setTimeout(() => notification.close(), 4000);
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (audioRef.current && audioInitialized) {
      audioRef.current.play().catch((error) => {
        console.log("Audio play failed - user interaction required for autoplay policies");
      });
    }
  };

  // Listen for custom events from AccountProvider
  useEffect(() => {
    const handleNewMessageNotification = (event) => {
      const notification = {
        id: Date.now() + Math.random(),
        ...event.detail,
        timestamp: new Date(),
      };

      // Play sound and show browser notification
      playNotificationSound();
      showBrowserNotification(notification);

      setNotifications((prev) => [notification, ...prev.slice(0, 4)]); // Keep only last 5 notifications

      // Auto-remove notification after 3 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
      }, 3000);
    };

    // Add event listener
    window.addEventListener("newMessageNotification", handleNewMessageNotification);

    // Cleanup
    return () => {
      window.removeEventListener("newMessageNotification", handleNewMessageNotification);
    };
  }, [browserPermission, audioInitialized]);

  // Handle notification click
  const handleNotificationClick = (notification) => {
    // Mark the chat as read
    markChatAsRead?.(notification.chatId);

    // Navigate to the specific chat
    console.log("Navigate to chat:", notification.chatId);
  };

  // Handle notification close
  const handleNotificationClose = (notificationId) => {
    setDismissedNotifications((prev) => new Set([...prev, notificationId]));
  };

  // Filter out dismissed notifications
  const activeNotifications = notifications.filter(
    (notification) => !dismissedNotifications.has(notification.id)
  );

  return (
    <>
      {activeNotifications.map((notification) => (
        <NotificationBanner
          key={notification.id}
          notification={notification}
          onClose={() => handleNotificationClose(notification.id)}
          onClick={() => handleNotificationClick(notification)}
          isMobile={isMobile}
        />
      ))}
    </>
  );
};

export default NotificationManager;
