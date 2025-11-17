import { useContext, useEffect, useState } from "react";
import { Box, Typography, styled } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import { setConversation, getConversation } from "../../../service/api";
import { formatDate } from "../../../utils/common-utils.js";
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
  marginRight: "10px",
});
const Container = styled(Box)`
  display: flex;
`;
const Timestamp = styled(Typography)`
  font-size: 12px;
  margin-left: auto;
  color: #00000099;
  // margin-right: 20px;
`;
const Text = styled(Typography)`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.9);
`;

const Conversation = ({ user, setMobileView }) => {
  const { setPerson, account, newMessageFlag } = useContext(AccountContext);

  const [message, setMessage] = useState({});

  useEffect(() => {
    const getConversationDetails = async () => {
      const data = await getConversation({ senderId: account.sub, receiverId: user.sub });
      setMessage({ text: data?.message, timestamp: data?.updatedAt });
    };
    getConversationDetails();
  }, []);

  const getUser = async () => {
    setPerson(user);
    await setConversation({ senderId: account.sub, receiverId: user.sub });
    if (setMobileView) setMobileView("chat");
  };
  return (
    <Component onClick={() => getUser()}>
      <Box>
        <Image
          src={user.picture || "/Images/Default-Avatar.jpg"}
          alt="dp"
          onError={(e) => {
            e.target.src = "/Images/Default-Avatar.jpg";
          }}
        />
      </Box>
      <Box style={{ width: "100%" }}>
        <Container>
          <Typography>{user.name}</Typography>
          {message?.text && <Timestamp>{formatDate(message?.timestamp)}</Timestamp>}
        </Container>
        <Box>
          <Text>{message?.text?.includes("localhost") ? "media" : message.text}</Text>
        </Box>
      </Box>
    </Component>
  );
};
export default Conversation;
