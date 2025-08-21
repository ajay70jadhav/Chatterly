import { useContext } from "react";
import { Box, Typography, styled } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import { setConversation } from "../../../service/api";
const Component = styled(Box)`
  display: flex;
  padding: 8px 16px;
  cursor: pointer;
  align-items: center;
`;
const Image = styled("img")({
  height: 50,
  width: 50,
  borderRadius: "50%",
  objectFit: "cover",
});

const Conversation = ({ user }) => {
  const { setPerson, account } = useContext(AccountContext);

  const getUser = async () => {
    setPerson(user);
    await setConversation({ senderId: account.sub, receiverId: user.sub });
  };
  return (
    <Component onClick={() => getUser()}>
      <Box>
        <Image src={user.picture || "/Images/Default-Avatar.jpg"} alt="dp" />
      </Box>
      <Box>
        <Typography>{user.name}</Typography>
      </Box>
    </Component>
  );
};
export default Conversation;
