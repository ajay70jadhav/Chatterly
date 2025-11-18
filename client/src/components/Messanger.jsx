import { useContext } from "react";
import { AppBar, Box, Toolbar, styled } from "@mui/material";
import { AccountContext } from "../context/AccountProvider";
import { NotificationContext } from "../context/NotificationContext";
import NotificationBanner from "./notifications/NotificationBanner";

//components
import LoginDialog from "./account/LoginDialog";
import ChatDialog from "./chat/ChatDialog";

const Component = styled(Box)`
  height: 100vh;
  background: #dcdcdc;
`;
const Header = styled(AppBar)`
  height: 125px;
  background-color: #00a884;
  box-shadow: none;

  @media (max-width: 768px) {
    height: 80px;
  }
`;
const LoginHeader = styled(AppBar)`
  height: 220px;
  background-color: #00bfa5;
  box-shadow: none;

  @media (max-width: 768px) {
    height: 120px;
  }
`;
const Messanger = () => {
  const { account } = useContext(AccountContext);
  const { notifications } = useContext(NotificationContext);

  return (
    <Component>
      {account ? (
        <>
          <Header>
            <Toolbar></Toolbar>
          </Header>
          <ChatDialog />

          {/* Notification Banners */}
          {notifications.map((notification) => (
            <NotificationBanner
              key={notification.id}
              notification={notification}
              isMobile={false}
            />
          ))}
        </>
      ) : (
        <>
          <LoginHeader>
            <Toolbar></Toolbar>
          </LoginHeader>

          <LoginDialog />
        </>
      )}
    </Component>
  );
};

export default Messanger;
