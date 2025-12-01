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
        newMessageFlag, // Boolean to trigger message list refresh
        setNewMessageFlag, // Function to toggle message refresh flag
      }}
    >
      {/* Renders all child components that can access global state */}
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;

/////////////////////////////////////////
//============OLD CODE=========//
/*

import { createContext, useState, useRef, useEffect } from "react";

import { io } from "socket.io-client";

export const AccountContext = createContext(null);

const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState();
  const [person, setPerson] = useState({});
  const [activeUsers, setActiveUsers] = useState([]);
  const [newMessageFlag, setNewMessageFlag] = useState(false);

  const socket = useRef();

  useEffect(() => {
    socket.current = io("ws://localhost:9000");
  }, []);

  return (
    <AccountContext.Provider
      value={{
        account,
        setAccount,
        person,
        setPerson,
        socket,
        activeUsers,
        setActiveUsers,
        newMessageFlag,
        setNewMessageFlag,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export default AccountProvider;

*/
