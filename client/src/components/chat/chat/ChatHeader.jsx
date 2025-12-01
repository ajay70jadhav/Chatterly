import { useContext, useMemo } from "react";
import { Box, Typography, styled } from "@mui/material";
import { Search, MoreVert, ArrowBack } from "@mui/icons-material";

// Performance optimization: useMemo caches expensive calculations
// This prevents re-calculating user status on every render
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
  // Get active users from global state (manages who is online/offline)
  const { activeUsers } = useContext(AccountContext);

  // PERFORMANCE: Cache expensive calculations with useMemo
  // This prevents re-calculating user status on every component re-render
  const userStatus = useMemo(() => {
    // Find if current chat person is in active users list
    return activeUsers?.find((user) => user.sub === person.sub) ? "online" : "offline";
  }, [activeUsers, person.sub]);

  // PERFORMANCE: Cache mobile detection to avoid repeated window checks
  const isMobileView = window.innerWidth <= 768;

  return (
    <Header>
      {/* Mobile back button: Only show on small screens */}
      {isMobileView && (
        <ArrowBack
          onClick={() => setMobileView("menu")}
          style={{ marginRight: 10, cursor: "pointer" }}
        />
      )}

      {/* Chat person's profile picture with error handling */}
      <Image
        src={person.picture}
        alt="dp"
        onError={(e) => {
          // Fallback to default avatar if profile picture fails to load
          e.target.src = "/Images/Default-Avatar.jpg";
        }}
      />

      {/* Person's name and online status */}
      <Box>
        <Name>{person.name}</Name>
        <Status>{userStatus}</Status>
      </Box>

      {/* Action buttons on the right */}
      <RightContainer>
        <Search />
        <MoreVert />
      </RightContainer>
    </Header>
  );
};

export default ChatHeader;
