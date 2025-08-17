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
backgroundL#e9edef;
opacity: 0.6`;

//component
const Conversations = () => {
  const [users, setUsers] = useState([]);
  const { account } = useContext(AccountContext);
  useEffect(() => {
    const fetchData = async () => {
      let res = await getUsers();
      setUsers(res);
    };
    fetchData();
  }, []);
  return (
    <Component>
      {users.map(
        (user) =>
          user.sub !== account.sub && (
            <>
              <Conversation key={user._id} user={user} />
              <StyledDivider />
            </>
          )
      )}
    </Component>
  );
};
export default Conversations;
