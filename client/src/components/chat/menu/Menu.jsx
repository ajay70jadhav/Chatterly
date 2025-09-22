import { useState, useContext } from "react";
import React from "react";
import { Box } from "@mui/material";
// components
import Header from "./Header";
import Search from "./Search";
import Conversations from "./Conversations";
import { AccountContext } from "../../../context/AccountProvider";

const Menu = () => {
  const [text, setText] = useState("");
  const { account } = useContext(AccountContext);

  return (
    <Box>
      <Header />
      <Search setText={setText} />
      {account ? (
        <Conversations text={text} />
      ) : (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Loading users...</p>
      )}
    </Box>
  );
};

export default Menu;
