import React from "react";
import { Drawer, Box, Typography, styled } from "@mui/material";
//icons
import { ForkLeft, Height } from "@mui/icons-material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
//you can also do like this for importing arrowback icon
// import { ArrowBack } from "@mui/icons-material";

//components
import Profile from "./Profile";

const Header = styled(Box)`
  background: #008069;
  height: 107px;
  color: #ffffff;
  display: flex;
  padding: 0 15px;

  & > svg,
  & > p {
    margin-top: auto;
    margin-right: 15px;
    margin-bottom: 15px;
    font-weight: 600;
  }
`;
const Component = styled(Box)`
  background: #ededed;
  height: 85%;
`;
const Text = styled(Typography)`
  font-size: 18px;
`;
const drawerStyle = {
  left: 20,
  top: 17,
  height: "95%",
  width: "30%",
  boxShadow: "none",
};
const InfoDrawer = ({ open, setOpen }) => {
  const handleClose = () => {
    setOpen(false);
  };
  return (
    <Drawer
      open={open}
      onClose={handleClose}
      slotProps={{ paper: { sx: drawerStyle } }}
      style={{ zIndex: 1500 }}
    >
      <Header>
        <ArrowBackIcon onClick={() => setOpen(false)} />
        <Text>Profile</Text>
      </Header>
      <Component>
        <Profile />
      </Component>
    </Drawer>
  );
};

export default InfoDrawer;
