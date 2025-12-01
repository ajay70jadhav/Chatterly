import { useContext, useState } from "react";
import { Dialog, Box, styled } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";
//components
import Menu from "./menu/Menu";
import EmptyChat from "./chat/EmptyChat";
import ChatBox from "./chat/ChatBox";
// Styled components
const Component = styled(Box)`
  display: flex;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const LeftComponent = styled(Box)`
  min-width: 450px;

  @media (max-width: 768px) {
    min-width: auto;
    width: 100%;
    height: 100%;

    .show-chat & {
      display: none;
    }
  }
`;
const RightComponent = styled(Box)`
  width: 73%;
  min-width: 300px;
  height: 100%;
  border-left: 1px solid rgba(0, 0, 0, 0.14);

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
    height: 100%;
    border-left: none;
    display: none;

    .show-chat & {
      display: block;
    }
  }
`;
const dialogstyle = {
  height: "95vh",
  width: "100%",
  margin: "20px",
  borderRadius: 0,
  maxWidth: "calc(100vw - 40px)",
  maxHeight: "95vh",
  boxShadow: "none",
  overflow: "hidden",
  padding: 0,
  position: "relative",

  "@media (max-width: 768px)": {
    height: "calc(100vh - 80px)",
    width: "100vw",
    margin: 0,
    maxWidth: "100vw",
    maxHeight: "calc(100vh - 80px)",
  },
};

const ChatDialog = () => {
  const { person } = useContext(AccountContext);
  const [mobileView, setMobileView] = useState("menu");

  return (
    <>
      <Dialog
        open={true}
        hideBackdrop={true}
        fullWidth
        maxWidth={false}
        PaperProps={{
          sx: dialogstyle,
        }}
      >
        <Component className={mobileView === "chat" ? "show-chat" : ""}>
          <LeftComponent>
            <Menu setMobileView={setMobileView} />
          </LeftComponent>
          <RightComponent>
            {Object.keys(person).length ? <ChatBox setMobileView={setMobileView} /> : <EmptyChat />}
          </RightComponent>
        </Component>
      </Dialog>
    </>
  );
};

export default ChatDialog;
