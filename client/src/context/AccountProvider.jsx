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
  }, []);

  // ===================== SOCKET.IO EVENT LISTENERS =====================
  // Listen for real-time notifications
  useEffect(() => {
    if (!socket.current) return;

    // Listen for new message notifications
    socket.current.on("newMessageNotification", (data) => {
      // Only show notification if not currently viewing the chat
      if (person.sub !== data.senderId) {
        // Trigger a custom event that NotificationManager will listen to
        window.dispatchEvent(new CustomEvent("newMessageNotification", { detail: data }));
      }
    });

    // Listen for offline notifications when user comes online
    socket.current.on("getOfflineNotifications", (notifications) => {
      notifications.forEach((notif) => {
        // Only show notifications for chats not currently being viewed
        if (person.sub !== notif.senderId) {
          window.dispatchEvent(new CustomEvent("newMessageNotification", { detail: notif }));
        }
      });
    });

    // Cleanup listeners
    return () => {
      socket.current?.off("newMessageNotification");
      socket.current?.off("getOfflineNotifications");
    };
  }, [socket, person.sub]);

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
