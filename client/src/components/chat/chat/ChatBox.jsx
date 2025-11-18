import { useContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import ChatHeader from "./ChatHeader";
import Messages from "./Messages";
import { getConversation } from "../../../service/api";

//main component
const ChatBox = ({ setMobileView }) => {
  const { person, account } = useContext(AccountContext);
  const [conversation, setConversation] = useState({});
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const getConversationDetails = async () => {
      if (!person?.sub || !account?.sub) {
        setConversation({});
        setConversationId(null);
        return;
      }

      try {
        let data = await getConversation({ senderId: account.sub, receiverId: person.sub });
        setConversation(data || {});
        setConversationId(data?._id || null);
      } catch (error) {
        console.error("Error fetching conversation:", error);
        setConversation({});
        setConversationId(null);
      }
    };

    // Clear previous conversation data when person changes
    setConversation({});
    setConversationId(null);

    getConversationDetails();
  }, [person.sub, account.sub]); // Depend on both person and account

  return (
    <Box style={{ height: "100%" }}>
      <ChatHeader person={person} setMobileView={setMobileView} />

      <Messages
        person={person}
        conversation={conversation}
        conversationId={conversationId}
        setMobileView={setMobileView}
      />
    </Box>
  );
};

export default ChatBox;
