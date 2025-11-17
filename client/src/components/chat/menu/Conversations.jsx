import { useEffect, useState, useContext } from "react";
import { getUsers } from "../../../service/api";
import { Box, styled, Divider } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
//import components
import Conversation from "./Conversation";

const Component = styled(Box)`
  height: 81vh;
  overflow: overlay;

  @media (max-width: 768px) {
    height: auto;
    flex: 1;
  }
`;

const StyledDivider = styled(Divider)`
  margin: 0 0 0 70px;
  background: #e9edef;
  opacity: 0.6;
`;

const Conversations = ({ text, setMobileView }) => {
  // Local state: stores filtered list of users for display
  const [users, setUsers] = useState([]);

  // Global state: current user info, socket connection, active users list
  const { account, socket, setActiveUsers } = useContext(AccountContext);

  // ===================== FETCH USERS FROM DATABASE =====================
  // This effect fetches all registered users and filters them based on search text
  useEffect(() => {
    const fetchData = async () => {
      // Safety check: only proceed if user is logged in
      if (!account?.sub) return;

      // Fetch all users from the backend database
      const res = await getUsers();
      if (!res) return; // Handle API failures gracefully

      // Filter users to show in the chat list:
      // 1. Exclude current logged-in user
      // 2. Only show users with names
      // 3. Filter by search text (case-insensitive)
      const filteredData = res.filter(
        (user) =>
          user.sub !== account.sub && // Don't show yourself in the users list
          user.name && // Only users with valid names
          user.name.toLowerCase().includes(text.toLowerCase()) // Search functionality
      );

      setUsers(filteredData);
    };

    // PERFORMANCE: Debounce API calls (300ms delay)
    // This prevents making excessive API requests while user types in search
    const debounceTimer = setTimeout(fetchData, 300);
    return () => clearTimeout(debounceTimer);
  }, [text, account?.sub]); // Dependencies: search text + user ID

  // ===================== REAL-TIME USER STATUS =====================
  // This effect manages real-time online/offline status via Socket.IO
  useEffect(() => {
    if (!account?.sub) return; // Only proceed when user is logged in

    // Tell socket server this user is now active (online)
    socket.current?.emit("addUsers", account);

    // Listen for real-time updates of active users
    socket.current?.on("getUsers", (users) => {
      setActiveUsers(users); // Update global state with online users
    });

    // CLEANUP: Remove socket listeners when component unmounts
    // This prevents memory leaks and duplicate event handlers
    return () => socket.current?.off("getUsers");
  }, [account?.sub, setActiveUsers]);

  return (
    <Component>
      {users.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No users found</p>
      ) : (
        users.map((user) => (
          <Box key={user._id}>
            <Conversation user={user} setMobileView={setMobileView} />
            <StyledDivider />
          </Box>
        ))
      )}
    </Component>
  );
};

export default Conversations;
