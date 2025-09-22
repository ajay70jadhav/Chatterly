import { useEffect, useState, useContext } from "react";
import { getUsers } from "../../../service/api";
import { Box, styled, Divider } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
//import components
import Conversation from "./Conversation";

const Component = styled(Box)`
  height: 81vh;
  overflow: overlay;
`;

const StyledDivider = styled(Divider)`
  margin: 0 0 0 70px;
  background: #e9edef;
  opacity: 0.6;
`;

const Conversations = ({ text }) => {
  const [users, setUsers] = useState([]);
  const { account, socket, setActiveUsers } = useContext(AccountContext);

  // ===================== FETCH USERS =====================
  useEffect(() => {
    const fetchData = async () => {
      if (!account) return; // wait until account is available
      const res = await getUsers();
      if (!res) return; // safety check in case API fails

      const filteredData = res.filter(
        (user) =>
          user.sub !== account.sub && // exclude logged-in user
          user.name && // ensure name exists
          user.name.toLowerCase().includes(text.toLowerCase())
      );

      setUsers(filteredData);
    };

    fetchData();
  }, [text, account]); // added 'account' dependency

  // ===================== SOCKET USERS =====================
  useEffect(() => {
    if (!account) return; // ensure account exists before emitting

    socket.current.emit("addUsers", account);
    socket.current.on("getUsers", (users) => {
      setActiveUsers(users);
    });

    // clean up listener to avoid duplicate events
    return () => socket.current.off("getUsers");
  }, [account, socket, setActiveUsers]);

  return (
    <Component>
      {users.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "20px" }}>No users found</p>
      ) : (
        users.map((user) => (
          <Box key={user._id}>
            <Conversation user={user} />
            <StyledDivider />
          </Box>
        ))
      )}
    </Component>
  );
};

export default Conversations;
