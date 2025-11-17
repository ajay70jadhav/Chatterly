import { useContext } from "react";
import { Box, styled, Typography } from "@mui/material";
import { AccountContext } from "../../context/AccountProvider";

const ImageContainer = styled(Box)`
  display: flex;
  justify-content: center;
`;
const Image = styled("img")({
  width: 200,
  height: 200,
  borderRadius: "50%",
  padding: "25px",
});

const BoxWrapper = styled(Box)`
  background: #ffffff;
  padding: 12px 30px 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  & :first-child {
    font-size: 13px;
    color: #009688;
    font-weight: 200;
  }
  & :last-child {
    margin: 14px 0;
    color: #4a4a4a;
  }
`;
const DescriptionContainer = styled(Box)`
  padding: 15px 20px 28px 30px;
  & > p {
    font-size: 13px;
    color: #8696a0;
  }
`;
const Profile = () => {
  const { account } = useContext(AccountContext);
  return (
    <>
      <ImageContainer>
        <Image
          src={account.picture}
          alt=""
          onError={(e) => {
            e.target.src = "/Images/Default-Avatar.jpg";
          }}
        />
      </ImageContainer>
      <BoxWrapper>
        <Typography>Your name</Typography>
        <Typography>{account.name}</Typography>
      </BoxWrapper>
      <Box>
        <DescriptionContainer>
          <Typography>
            This is not username or pin. This name well be visible to your Whatsapp contacts
          </Typography>
        </DescriptionContainer>
      </Box>
      <BoxWrapper>
        <Typography>About</Typography>
        <Typography>Eat! Sleep! Code! Repeat!</Typography>
      </BoxWrapper>
    </>
  );
};

export default Profile;
