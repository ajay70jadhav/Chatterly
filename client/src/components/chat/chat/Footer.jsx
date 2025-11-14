import { useEffect } from "react";
import { Box, InputBase, styled } from "@mui/material";
import { EmojiEmotionsOutlined, AttachFile, Mic, Send } from "@mui/icons-material";
import { uploadFile } from "../../../service/api";

const Container = styled(Box)`
  height: 55px;
  background: #ededed;
  display: flex;
  width: 100%;
  align-items: center;
  padding: 0 15px;
  & > * {
    margin: 5px;
    color: #919191;
  }
`;
const Search = styled(Box)`
  background-color: #ffffff;
  border-radius: 18px;
  width: calc(94% - 100px);
`;
const InputField = styled(InputBase)`
  width: 100%;
  padding: 20px;
  height: 20px;
  padding-left: 25px;
  font-size: 14px;
`;
const ClipIcon = styled(AttachFile)`
  transform: rotate(40deg);
`;

const Footer = ({ sendText, setValue, value, file, setFile, setImage }) => {
  useEffect(() => {
    const getImage = async () => {
      if (file) {
        const data = new FormData();
        // data.append("name", file.name);
        data.append("file", file);

        let res = await uploadFile(data);
        console.log(res);
        setImage(res.data);
      }
    };
    getImage();
  }, [file]);

  const onFileChange = (e) => {
    console.log(e);
    setFile(e.target.files[0]);
    setValue(e.target.files[0].name);
  };

  const handleSendClick = () => {
    if (value.trim()) {
      sendText({ keyCode: 13, which: 13 }); // Simulate Enter key press
    }
  };

  return (
    <Container>
      <EmojiEmotionsOutlined />

      {/* <label htmlFor="fileInput">
        <ClipIcon />
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={(e) => {
          onFileChange(e);
        }}
      /> */}
      {/* we use this after completing our project beacuse it is giveing some problems  */}
      <Search>
        <InputField
          placeholder="Type a message"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => sendText(e)} // pass event to parent
          value={value}
        />
      </Search>
      <Send
        onClick={handleSendClick}
        style={{
          cursor: value.trim() ? "pointer" : "not-allowed",
          color: value.trim() ? "#007bff" : "#919191",
        }}
      />
    </Container>
  );
};

export default Footer;
