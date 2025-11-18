import { useContext, useState, useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";

// Global state management for user accounts and socket connections
import { AccountContext } from "../../../context/AccountProvider";
import { NotificationContext } from "../../../context/NotificationContext";

// API calls for messaging functionality
import { newMessage, getMessages } from "../../../service/api";

// Local components for chat interface
import Footer from "./Footer";
import Message from "./Message";

const Wrapper = styled(Box)`
  background-image: url(${`https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png`});
  background-size: 50%;
`;

const Component = styled(Box)`
  height: 80vh;
  overflow-y: scroll;

  @media (max-width: 768px) {
    height: 75vh;
  }
`;
const Container = styled(Box)`
  padding: 1px 80px;

  @media (max-width: 768px) {
    padding: 1px 10px;
  }
`;

const Messages = ({ person, conversation, conversationId }) => {
  // LOCAL STATE: Component-specific data that doesn't need global sharing
  const [value, setValue] = useState(""); // Current message input text
  const [messages, setMessages] = useState([]); // Chat messages for current conversation
  const [file, setFile] = useState(); // Selected file for sharing (currently disabled)
  const [image, setImage] = useState(""); // Image URL after file upload

  // REFERENCE: For scrolling to bottom of chat when new messages arrive
  const scrollRef = useRef();

  // GLOBAL STATE: Shared across the entire app via AccountContext
  const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);
  const { addNotification } = useContext(NotificationContext);

  // ===================== LOAD CHAT HISTORY =====================
  // Fetches previous messages when user switches to a new conversation
  useEffect(() => {
    const getMessageDetails = async () => {
      if (!conversationId) {
        setMessages([]); // Clear messages when no conversation
        return;
      }

      // Fetch all messages for this conversation from database
      try {
        const data = await getMessages(conversationId);
        setMessages(data || []); // Set empty array if no messages found
      } catch (error) {
        console.error("Error fetching messages:", error);
        setMessages([]);
      }
    };

    getMessageDetails();
  }, [conversationId, newMessageFlag]); // Depend on conversationId and newMessageFlag

  // ===================== AUTO-SCROLL TO LATEST MESSAGE =====================
  // Automatically scrolls chat to bottom when new messages arrive
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Trigger when messages array updates

  // ===================== HANDLE INCOMING MESSAGES =====================
  // Listen for incoming messages from AccountContext custom event
  useEffect(() => {
    const handleIncomingMessage = (event) => {
      const message = event.detail;

      // Only show message if it's for the current conversation and from current person
      if (message && person?.sub && message.senderId === person.sub && conversationId) {
        setMessages((prev) => [...prev, { ...message, createdAt: Date.now() }]);

        // Add notification for unread count
        if (message.conversationId) {
          addNotification({
            senderId: message.senderId,
            senderName: person.name,
            messagePreview: message.text || "Sent a file/image",
            messageType: message.type,
            chatId: message.conversationId,
            senderPicture: person.picture,
          });
        }
      }
    };

    // Add event listener for incoming messages
    window.addEventListener("incomingMessage", handleIncomingMessage);

    // Cleanup listener
    return () => {
      window.removeEventListener("incomingMessage", handleIncomingMessage);
    };
  }, [socket, person?.sub, conversationId, addNotification, person]);

  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      if (!person?.sub || !conversationId) return; // <-- safety check

      let message = {};
      if (!file) {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversationId,
          type: "text",
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversationId,
          type: "file",
          text: image,
        };
      }

      socket.current?.emit("sendMessage", message);
      await newMessage(message);

      setValue("");
      setFile("");
      setImage("");

      setNewMessageFlag((prev) => !prev);
    }
  };

  // If conversation or person is missing, show empty chat
  if (!person || !conversationId)
    return <p style={{ textAlign: "center", marginTop: "20px" }}>No conversation selected</p>;

  return (
    <Wrapper>
      <Component>
        {messages.map((message, index) => (
          <Container key={index} ref={scrollRef}>
            <Message message={message} />
          </Container>
        ))}
      </Component>
      <Footer
        sendText={sendText}
        setValue={setValue}
        value={value}
        file={file}
        setFile={setFile}
        setImage={setImage}
      />
    </Wrapper>
  );
};

export default Messages;
