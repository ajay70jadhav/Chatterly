import { useContext, useState } from "react";
import { Dialog, Box, styled } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";
//components
import Menu from "./menu/Menu";
import EmptyChat from "./chat/EmptyChat";
import ChatBox from "./chat/ChatBox";
const Component = styled(Box)`
  display: flex;
  height: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const LeftComponent = styled(Box)`
  width: 27%;
  min-width: 300px;
  max-width: 400px;
  height: 100%;

  @media (max-width: 1200px) {
    width: 30%;
    min-width: 280px;
  }

  @media (max-width: 900px) {
    width: 35%;
    min-width: 250px;
  }

  @media (max-width: 768px) {
    width: 100%;
    min-width: auto;
    max-width: 100%;
    height: 100%;

    .show-chat & {
      display: none;
    }
  }
`;
const RightComponent = styled(Box)`
  width: 73%;
  min-width: 0;
  flex: 1;
  height: 100%;
  border-left: 1px solid rgba(0, 0, 0, 0.14);

  @media (max-width: 1200px) {
    width: 70%;
  }

  @media (max-width: 900px) {
    width: 65%;
  }

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
  height: "95%",
  width: "100%",
  margin: "20px",
  borderRadius: 0,
  maxWidth: "100%",
  maxHeight: "100%",
  boxShadow: "none",
  overflow: "hidden",

  "@media (max-width: 768px)": {
    height: "calc(100vh - 80px)",
    margin: "0",
  },
};
const ChatDialog = () => {
  const { person } = useContext(AccountContext);
  const [mobileView, setMobileView] = useState("menu");

  return (
    <>
      <Dialog open={true} slotProps={{ paper: { sx: dialogstyle } }} hideBackdrop={true}>
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
