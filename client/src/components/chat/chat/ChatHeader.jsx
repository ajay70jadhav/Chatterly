import { useContext } from "react";
import { Box, Typography, styled } from "@mui/material";
import { Search, MoreVert, ArrowBack } from "@mui/icons-material";

import { defaultProfilePicture } from "../../../constants/data/";

import { AccountContext } from "../../../context/AccountProvider";

const Header = styled(Box)`
  height: 54px;
  background: #ededed;
  padding: 8px 16px;
  display: flex;
  align-items: center;
`;
const Image = styled("img")({
  height: 40,
  width: 40,
  objectFit: "cover",
  borderRadius: "50%",
});
const Name = styled(Typography)`
  margin-left: 12px !important;
`;

const Status = styled(Typography)`
  margin-left: 12px !important;
  font-size: 12px;
  color: rgb(0, 0, 0, 0.6);
`;
const RightContainer = styled(Box)`
  margin-left: auto;
  & > svg {
    margin-left: 15px;
    font-size: 24px;
    color: #000;
  }
`;

const ChatHeader = ({ person, setMobileView }) => {
  const { activeUsers } = useContext(AccountContext);
  return (
    <Header>
      {window.innerWidth <= 768 && (
        <ArrowBack
          onClick={() => setMobileView("menu")}
          style={{ marginRight: 10, cursor: "pointer" }}
        />
      )}
      <Image
        src={person.picture}
        alt="dp"
        onError={(e) => {
          e.target.src = "/Images/Default-Avatar.jpg";
        }}
      />
      <Box>
        <Name>{person.name}</Name>
        <Status>
          {activeUsers?.find((user) => user.sub === person.sub) ? "online" : "offline"}
        </Status>
      </Box>
      <RightContainer>
        <Search />
        <MoreVert />
      </RightContainer>
    </Header>
  );
};

export default ChatHeader;
