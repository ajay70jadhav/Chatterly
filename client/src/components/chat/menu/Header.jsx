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
  height: 40,
  width: 40,
  borderRadius: "50%",
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
