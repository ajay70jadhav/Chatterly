// ===================== GLOBAL STATE MANAGEMENT =====================
// This file manages shared state across the entire chat application

import { createContext, useState, useRef, useEffect } from "react";
import { io } from "socket.io-client";

// CONTEXT: Creates a global state that any component can access
// Think of this as a "global store" like Redux, but simpler
export const AccountContext = createContext(null);

// PROVIDER: Manages global application state and socket connections
const AccountProvider = ({ children }) => {
  // ===================== USER STATE =====================
  const [account, setAccount] = useState(); // Current logged-in user profile
  const [person, setPerson] = useState({}); // Person user is currently chatting with
  const [activeUsers, setActiveUsers] = useState([]); // List of online users
  const [newMessageFlag, setNewMessageFlag] = useState(false); // Triggers message reloads

  // SOCKET: Real-time connection for instant messaging
  const socket = useRef();

  // ===================== SOCKET.IO CONNECTION =====================
  // Establishes real-time connection to handle instant messaging
  useEffect(() => {
    // Connect to deployed Socket.IO server on Render
    // This enables real-time features like:
    // - Instant message delivery
    // - Online/offline status updates
    // - Typing indicators (future feature)
    socket.current = io("https://chatterly-socketio.onrender.com/");

    // Cleanup socket connection on unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
    };
  }, []);

  // ===================== SOCKET.IO EVENT LISTENERS =====================
  // Single consolidated listener for all socket events
  useEffect(() => {
    if (!socket.current) return;

    // Handle incoming real-time messages
    const handleIncomingMessage = (data) => {
      // Add timestamp to incoming message
      const messageWithTimestamp = { ...data, createdAt: Date.now() };

      // Trigger a custom event that can be listened to by components
      window.dispatchEvent(
        new CustomEvent("incomingMessage", {
          detail: messageWithTimestamp,
        })
      );
    };

    // Handle new message notifications
    const handleNewMessageNotification = (data) => {
      // Only show notification if not currently viewing the chat
      if (person.sub !== data.senderId) {
        // Trigger notification event
        window.dispatchEvent(new CustomEvent("newMessageNotification", { detail: data }));
      }
    };

    // Handle offline notifications when user comes online
    const handleOfflineNotifications = (notifications) => {
      notifications.forEach((notif) => {
        // Only show notifications for chats not currently being viewed
        if (person.sub !== notif.senderId) {
          window.dispatchEvent(new CustomEvent("newMessageNotification", { detail: notif }));
        }
      });
    };

    // Register all socket event listeners
    socket.current.on("getMessage", handleIncomingMessage);
    socket.current.on("newMessageNotification", handleNewMessageNotification);
    socket.current.on("getOfflineNotifications", handleOfflineNotifications);

    // Handle online users updates
    socket.current.on("getUsers", (users) => {
      setActiveUsers(users);
    });

    // Cleanup function to remove all listeners
    return () => {
      socket.current?.off("getMessage", handleIncomingMessage);
      socket.current?.off("newMessageNotification", handleNewMessageNotification);
      socket.current?.off("getOfflineNotifications", handleOfflineNotifications);
      socket.current?.off("getUsers");
    };
  }, [socket, person.sub]); // Re-register when person changes

  // ===================== SOCKET USER MANAGEMENT =====================
  // Manage user online/offline status
  useEffect(() => {
    if (!socket.current || !account?.sub) return;

    // Tell socket server this user is now active (online)
    socket.current.emit("addUsers", account);

    // Cleanup when account changes
    return () => {
      // User disconnection will be handled by socket cleanup
    };
  }, [socket, account?.sub]);

  // ===================== PROVIDE GLOBAL STATE =====================
  // Makes all state variables and functions available to any component
  return (
    <AccountContext.Provider
      value={{
        account, // Current user profile (Google OAuth data)
        setAccount, // Function to update current user
        person, // Person currently being chatted with
        setPerson, // Function to set chat partner
        socket, // Socket.IO connection for real-time messaging
        activeUsers, // Array of currently online users
        setActiveUsers, // Function to update online users list
        newMessageFlag, // Boolean to trigger message refresh
        setNewMessageFlag, // Function to toggle message refresh flag
      }}
    >
      {/* Renders all child components that can access global state */}
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;
