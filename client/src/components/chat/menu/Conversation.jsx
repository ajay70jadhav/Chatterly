import { useContext, useEffect, useState } from "react";
import { Box, Typography, styled, Badge } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import { NotificationContext } from "../../../context/NotificationContext";
import { setConversation, getConversation } from "../../../service/api";
import { formatDate } from "../../../utils/common-utils.js";

const Component = styled(Box)`
  display: flex;
  padding: 8px 16px;
  cursor: pointer;
  align-items: center;
  position: relative;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: rgba(0, 168, 132, 0.1);
  }
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
  align-items: center;
  width: 100%;
`;

const TextContainer = styled(Box)`
  flex: 1;
  min-width: 0;
`;

const TypographyName = styled(Typography)`
  font-size: 16px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.87);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 60px);
`;

const Timestamp = styled(Typography)`
  font-size: 12px;
  color: #00000099;
  margin-left: 8px;
  flex-shrink: 0;
`;

const MessagePreview = styled(Typography)`
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: calc(100% - 40px);
`;

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#00a884",
    color: "white",
    fontSize: "11px",
    fontWeight: "600",
    minWidth: "18px",
    height: "18px",
    borderRadius: "9px",
    right: "8px",
    top: "8px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
}));

const Conversation = ({ user, setMobileView }) => {
  const { setPerson, account, newMessageFlag } = useContext(AccountContext);
  const { getUnreadCount, markChatAsRead } = useContext(NotificationContext);

  const [message, setMessage] = useState({});
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const getConversationDetails = async () => {
      const data = await getConversation({ senderId: account.sub, receiverId: user.sub });
      if (data) {
        setMessage({ text: data?.message, timestamp: data?.updatedAt });
        setConversationId(data._id);
      }
    };
    getConversationDetails();
  }, [user.sub, account.sub]);

  const getUser = async () => {
    setPerson(user);
    const conversationData = await setConversation({ senderId: account.sub, receiverId: user.sub });

    // Mark chat as read when opening
    if (conversationData && conversationData._id) {
      markChatAsRead(conversationData._id);
    }

    if (setMobileView) setMobileView("chat");
  };

  return (
    <Component onClick={() => getUser()}>
      <StyledBadge
        badgeContent={
          conversationId && getUnreadCount(conversationId) > 0
            ? getUnreadCount(conversationId)
            : null
        }
        invisible={!conversationId || getUnreadCount(conversationId) === 0}
      >
        <Image
          src={user.picture || "/Images/Default-Avatar.jpg"}
          alt={user.name}
          onError={(e) => {
            e.target.src = "/Images/Default-Avatar.jpg";
          }}
        />
      </StyledBadge>

      <TextContainer>
        <Container>
          <TypographyName>{user.name}</TypographyName>
          {message?.text && <Timestamp>{formatDate(message?.timestamp)}</Timestamp>}
        </Container>

        <Box>
          <MessagePreview>
            {message?.text?.includes("localhost")
              ? "📷 Media"
              : message?.text || "Start a conversation"}
          </MessagePreview>
        </Box>
      </TextContainer>
    </Component>
  );
};

export default Conversation;
