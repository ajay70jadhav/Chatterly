import { useState, useContext } from "react";
import React from "react";
import { Box } from "@mui/material";
// components
import Header from "./Header";
import Search from "./Search";
import Conversations from "./Conversations";
import { AccountContext } from "../../../context/AccountProvider";

const Menu = ({ setMobileView }) => {
  const [text, setText] = useState("");
  const { account } = useContext(AccountContext);

  return (
    <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Header />
      <Search setText={setText} />
      {account ? (
        <Conversations text={text} setMobileView={setMobileView} />
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Loading users...</p>
      )}
    </Box>
  );
};

export default Menu;
