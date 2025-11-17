import { useContext, useState, useEffect, useRef } from "react";
import { Box, styled } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
//api
import { newMessage, getMessages } from "../../../service/api";
//components
import Footer from "./Footer";
import Message from "./Message";

const Wrapper = styled(Box)`
  background-image: url(${"https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"});
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

const Messages = ({ person, conversation }) => {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState();
  const [image, setImage] = useState("");
  const [incomingMessage, setIncomingMessage] = useState(null);

  const scrollRef = useRef();

  const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

  // Listen for incoming messages
  useEffect(() => {
    socket.current?.on("getMessage", (data) => {
      setIncomingMessage({ ...data, createdAt: Date.now() });
    });
  }, [socket]);

  // Fetch messages when conversation changes
  useEffect(() => {
    const getMessageDetails = async () => {
      if (!conversation?._id) return; // <-- safety check
      const data = await getMessages(conversation._id);
      setMessages(data || []);
    };
    getMessageDetails();
  }, [conversation?._id, newMessageFlag]);

  // Scroll to the latest message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add incoming messages to the list
  useEffect(() => {
    if (incomingMessage && conversation?.members?.includes(incomingMessage.senderId)) {
      setMessages((prev) => [...prev, incomingMessage]);
    }
  }, [incomingMessage, conversation]);

  const sendText = async (e) => {
    const code = e.keyCode || e.which;
    if (code === 13) {
      if (!person?.sub || !conversation?._id) return; // <-- safety check

      let message = {};
      if (!file) {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversation._id,
          type: "text",
          text: value,
        };
      } else {
        message = {
          senderId: account.sub,
          receiverId: person.sub,
          conversationId: conversation._id,
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
  if (!person || !conversation)
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

//old code

// import { useContext, useState, useEffect, useRef } from "react";
// import { Box, styled } from "@mui/material";
// import { AccountContext } from "../../../context/AccountProvider";
// //api
// import { newMessage, getMessages } from "../../../service/api";
// //components
// import Footer from "./Footer";
// import Message from "./Message";

// const Wrapper = styled(Box)`
//   background-image: url(${"https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png"});
//   background-size: 50%;
// `;

// const Component = styled(Box)`
//   height: 80vh;
//   overflow-y: scroll;
// `;
// const Container = styled(Box)`
//   padding: 1px 80px;
// `;

// const Messages = ({ person, conversation }) => {
//   const [value, setValue] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [file, setFile] = useState();
//   const [image, setImage] = useState("");
//   const [incomingMessage, setIncomingMessage] = useState(null);

//   const scrollRef = useRef();

//   const { account, socket, newMessageFlag, setNewMessageFlag } = useContext(AccountContext);

//   useEffect(() => {
//     socket.current.on("getMessage", (data) => {
//       setIncomingMessage({ ...data, createdAt: Date.now() });
//     });
//   }, []);

//   useEffect(() => {
//     const getMessageDetails = async () => {
//       let data = await getMessages(conversation._id);
//       setMessages(data);
//     };
//     conversation._id && getMessageDetails();
//   }, [person._id, conversation._id, newMessageFlag]);

//   useEffect(() => {
//     scrollRef.current?.scrollIntoView({ transition: "smooth" });
//   }, [messages]);

//   useEffect(() => {
//     incomingMessage &&
//       conversation?.members?.includes(incomingMessage.senderId) &&
//       setMessages((prev) => [...prev, incomingMessage]);
//   }, [incomingMessage, conversation]);

//   const sendText = async (e) => {
//     const code = e.keyCode || e.which;

//     if (code === 13) {
//       let message = {};
//       if (!file) {
//         message = {
//           senderId: account.sub,
//           receiverId: person.sub,
//           conversationId: conversation._id,
//           type: "text",
//           text: value,
//         };
//       } else {
//         message = {
//           senderId: account.sub,
//           receiverId: person.sub,
//           conversationId: conversation._id,
//           type: "file",
//           text: image,
//         };
//       }

//       socket.current.emit("sendMessage", message); //here i am sending the message in real time to the socket server

//       // console.log("📤 Sending message:", message);
//       await newMessage(message);

//       setValue("");
//       setFile("");
//       setImage("");

//       setNewMessageFlag((prev) => !prev);
//     }
//   };

//   return (
//     <Wrapper>
//       <Component>
//         {messages &&
//           messages.map((message) => (
//             <Container ref={scrollRef}>
//               <Message message={message} />
//             </Container>
//           ))}
//       </Component>
//       <Footer
//         sendText={sendText}
//         setValue={setValue}
//         value={value}
//         file={file}
//         setFile={setFile}
//         setImage={setImage}
//       />
//     </Wrapper>
//   );
// };

// export default Messages;
