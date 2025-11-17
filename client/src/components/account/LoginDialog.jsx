import { useContext } from "react";
import { Dialog, Box, Typography, List, ListItem, styled } from "@mui/material";

import { qrCodeImage } from "../../constants/data";
import { AccountContext } from "../../context/AccountProvider";
import { addUser } from "../../service/api";

import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const dialogstyle = {
  height: "calc(100vh - 220px)",
  marginTop: "0",
  width: "60%",
  maxWidth: "100%",
  overflow: "hidden",

  "@media (max-width: 768px)": {
    height: "auto",
    width: "95%",
    marginTop: "20px",
  },
};

const Qrcode = styled("img")({
  height: 264,
  width: 264,
  margin: "50px 0px 0px 50px",

  // 🔥 Responsive QR size for mobile
  "@media (max-width: 768px)": {
    height: 180,
    width: 180,
    margin: "20px auto 0 auto",
    display: "block",
  },
  "@media (max-width: 480px)": {
    height: 120,
    width: 120,
    margin: "10px auto 0 auto",
  },
});

const Title = styled(Typography)`
  font-size: 26px;
  color: #4a4a4a;
  font-weight: 300;
  margin-bottom: 25px;

  @media (max-width: 768px) {
    text-align: center;
    font-size: 22px;
  }
  @media (max-width: 480px) {
    font-size: 18px;
    margin-bottom: 15px;
  }
`;

const StyledList = styled(List)`
  & > li {
    padding: 0;
    margin-top: 25px;
    font-size: 18px;
    line-height: 20px;
  }

  @media (max-width: 768px) {
    text-align: center;
    font-size: 16px;
    & > li {
      margin-top: 18px;
    }
  }
  @media (max-width: 480px) {
    font-size: 14px;
    & > li {
      margin-top: 12px;
      line-height: 16px;
    }
  }
`;

const Component = styled(Box)`
  display: flex;
  height: 100%;
  align-items: center;

  /* 🔥 MOBILE FIX — stack vertically */
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 20px;
    height: auto;
  }
`;

const Container = styled(Box)`
  padding: 56px 0px 56px 56px;

  @media (max-width: 768px) {
    padding: 20px;
  }
  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const LoginDialog = () => {
  const { setAccount } = useContext(AccountContext);

  const onLoginSuccess = async (res) => {
    const decoded = jwtDecode(res.credential);
    setAccount(decoded);
    await addUser(decoded);
  };

  const onLoginError = (res) => {
    console.log("Login Failed", res);
  };

  return (
    <Dialog open={true} slotProps={{ paper: { sx: dialogstyle } }} hideBackdrop={true}>
      <Component>
        {/* LEFT SIDE TEXT */}
        <Container>
          <Title>To use Whatsapp on your computer:</Title>
          <StyledList>
            <ListItem>1. Open Whatsapp on your phone</ListItem>
            <ListItem>2. Tap Menu or Setting and Select Linked Devices</ListItem>
            <ListItem>3. Point your phone to this screen to capture the code</ListItem>
          </StyledList>
        </Container>

        {/* RIGHT SIDE QR + LOGIN */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            position: "relative",

            "@media (min-width:768px)": {
              position: "relative",
              justifyContent: "center",
            },
          }}
        >
          <Qrcode src={qrCodeImage} alt="" />

          <Box>
            <GoogleLogin onSuccess={onLoginSuccess} onError={onLoginError} />
          </Box>
        </Box>
      </Component>
    </Dialog>
  );
};

export default LoginDialog;
