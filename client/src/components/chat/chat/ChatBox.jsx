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

  useEffect(() => {
    const getConversationDetails = async () => {
      let data = await getConversation({ senderId: account.sub, receiverId: person.sub });
      setConversation(data);
    };
    getConversationDetails();
  }, [person.sub]);

  return (
    <Box style={{ height: "100%" }}>
      <ChatHeader person={person} setMobileView={setMobileView} />

      <Messages person={person} conversation={conversation} setMobileView={setMobileView} />
    </Box>
  );
};

export default ChatBox;
