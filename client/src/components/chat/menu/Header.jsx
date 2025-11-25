import React from "react";

import { useContext, useState } from "react";
import { Box, styled } from "@mui/material";
import { AccountContext } from "../../../context/AccountProvider";
import { Chat as MessageIcon } from "@mui/icons-material";
//components
import HeaderMenu from "./HeaderMenu";
import InfoDrawer from "../../drawer/InfoDrawer";
const Component = styled(Box)`
  height: 54px;
  background: #ededed;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const Wrapper = styled(Box)`
  margin-left: auto;
  & > * {
    margin-left: 2px;
    color: #000;
  }
  & :first-child {
    font-size: 22px;
    margin-right: 8px;
    margin-top: 3px;
  }
`;

const Image = styled("img")({
  height: "min(40px, 8vw)",
  width: "min(40px, 8vw)",
  maxHeight: "40px",
  maxWidth: "40px",
  minHeight: "32px",
  minWidth: "32px",
  borderRadius: "50%",
  objectFit: "cover",

  "@media (max-width: 480px)": {
    height: "min(32px, 10vw)",
    width: "min(32px, 10vw)",
    maxHeight: "32px",
    maxWidth: "32px",
  },
});
const Header = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const { account } = useContext(AccountContext);
  const toggleDrawer = () => {
    setOpenDrawer(true);
  };
  return (
    <>
      <Component>
        <Image
          src={account.picture}
          alt="dp"
          onClick={() => {
            toggleDrawer();
          }}
          onError={(e) => {
            e.target.src = "/Images/Default-Avatar.jpg";
          }}
        />
        <Wrapper>
          <MessageIcon />
          <HeaderMenu setOpenDrawer={setOpenDrawer} />
        </Wrapper>
      </Component>
      <InfoDrawer open={openDrawer} setOpen={setOpenDrawer} />
    </>
  );
};
export default Header;
