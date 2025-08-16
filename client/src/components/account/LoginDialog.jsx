import { useContext } from "react";

import { Dialog, Box, Typography, List, ListItem, formControlClasses, styled } from "@mui/material";

import { qrCodeImage } from "../../constants/data";

import { AccountContext } from "../../context/AccountProvider";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const dialogstyle = {
  height: "96%",
  marginTop: "12%",
  width: "60%",
  maxWidth: "100%",
  maxHeight: "100%",
  boxShadow: "none",
  overflow: "hidden",
};

const Qrcode = styled("img")({ height: 264, width: 264, margin: "50px 0px 0px 50px" });

const Title = styled(Typography)`
  font-size: 26px;
  color: #525252;
  font-weight: 300;
  font-family: inherit;
  margin-bottom: 25px;
  color: #4a4a4a;
`;

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 25px;
    font-size: 18px;
    line-height: 20px;
  }
`;

const Component = styled(Box)`
  display: flex;
`;
const Container = styled(Box)`
  padding: 56px 0px 56px 56px;
`;

const LoginDialog = () => {
  const { setAccount } = useContext(AccountContext);

  const onLoginSuccess = (res) => {
    const decoded = jwtDecode(res.credential);
    setAccount(decoded);
  };
  const onLoginError = (res) => {
    console.log("Login Failed", res);
  };

  return (
    <Dialog open={true} slotProps={{ paper: { sx: dialogstyle } }} hideBackdrop={true}>
      <Component>
        <Container>
          <Title>To use Whatsapp on your computer:</Title>
          <StyledList>
            <ListItem>1. Open Whatsapp on your phone</ListItem>
            <ListItem>2. Tap Menu or Setting and Select Linked Devices</ListItem>
            <ListItem>3. Point your phone to this screen to capture the code</ListItem>
          </StyledList>
        </Container>
        <Box style={{ position: "relative" }}>
          <Qrcode src={qrCodeImage} alt="" />
          <Box
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <GoogleLogin onSuccess={onLoginSuccess} onError={onLoginError} />
          </Box>
        </Box>
      </Component>
    </Dialog>
  );
};
export default LoginDialog;
