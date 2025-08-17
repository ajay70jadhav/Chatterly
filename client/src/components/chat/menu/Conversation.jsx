import { Box, Typography, styled } from "@mui/material";

const Component = styled(Box)`
  display: flex;
  padding: 8px 16px;
  cursor: pointer;
  align-items: center;
`;
const Image = styled("img")({
  height: 50,
  width: 50,
  borderRadius: "50%",
  objectFit: "cover",
});

const Conversation = ({ user }) => {
  return (
    <Component>
      <Box>
        <Image src={user.picture} alt="dp" />
      </Box>
      <Box>
        <Typography>{user.name}</Typography>
      </Box>
    </Component>
  );
};
export default Conversation;
