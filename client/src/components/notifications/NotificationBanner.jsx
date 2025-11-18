import { useEffect, useState } from "react";
import { Box, Typography, styled, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";

const BannerWrapper = styled(Paper)(({ theme }) => ({
  position: "fixed",
  top: "20px",
  right: "20px",
  width: "350px",
  maxWidth: "90vw",
  minHeight: "80px",
  background: "linear-gradient(135deg, #00a884 0%, #25d366 100%)",
  color: "white",
  borderRadius: "12px",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
  zIndex: 1300, // Lower z-index to avoid conflicts
  cursor: "pointer",
  overflow: "hidden",
  animation: "slideInRight 0.3s ease-out",
  transform: "translateX(100%)",
  transition: "all 0.3s ease-out",

  "&.mobile": {
    top: "80px", // Position below header on mobile
    left: "50%",
    right: "auto",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "400px",
    zIndex: 1200, // Even lower on mobile
  },

  "&.show": {
    transform: "translateX(0)",
  },

  "&:hover": {
    boxShadow: "0 12px 40px rgba(0, 0, 0, 0.4)",
    transform: "translateX(-4px)",
  },

  "@keyframes slideInRight": {
    "0%": {
      transform: "translateX(100%)",
      opacity: 0,
    },
    "100%": {
      transform: "translateX(0)",
      opacity: 1,
    },
  },

  [theme.breakpoints.down("md")]: {
    top: "80px",
    left: "50%",
    right: "auto",
    transform: "translateX(-50%)",
    width: "90%",
    maxWidth: "400px",
    zIndex: 1200,
  },
}));

const BannerContent = styled(Box)({
  padding: "16px 20px",
  display: "flex",
  alignItems: "flex-start",
  gap: "12px",
  position: "relative",
});

const SenderAvatar = styled("img")({
  width: "40px",
  height: "40px",
  borderRadius: "50%",
  objectFit: "cover",
  border: "2px solid rgba(255, 255, 255, 0.3)",
  flexShrink: 0,
});

const CloseButton = styled(CloseIcon)({
  position: "absolute",
  top: "8px",
  right: "8px",
  cursor: "pointer",
  fontSize: "18px",
  padding: "4px",
  borderRadius: "50%",
  opacity: 0.7,
  transition: "opacity 0.2s ease",
  "&:hover": {
    opacity: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
});

const TextContent = styled(Box)({
  flex: 1,
  minWidth: 0, // Allow text to shrink
});

const SenderName = styled(Typography)({
  fontSize: "14px",
  fontWeight: "600",
  lineHeight: 1.2,
  marginBottom: "4px",
  textShadow: "0 1px 2px rgba(0, 0, 0, 0.2)",
});

const MessagePreview = styled(Typography)({
  fontSize: "13px",
  lineHeight: 1.3,
  opacity: 0.95,
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
});

const ChatIconStyled = styled(ChatIcon)({
  color: "rgba(255, 255, 255, 0.8)",
  fontSize: "20px",
});

const NotificationBanner = ({ notification, onClose, onClick, isMobile = false }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Auto-close after 4 seconds (increased from 3)
    const timer = setTimeout(() => {
      handleClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e) => {
    e?.stopPropagation(); // Prevent click event from firing
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  const handleClick = () => {
    onClick?.();
    handleClose();
  };

  const truncateMessage = (message, maxLength = 60) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  return (
    <BannerWrapper
      className={`${isVisible ? "show" : ""} ${isMobile ? "mobile" : ""}`}
      onClick={handleClick}
      elevation={6}
    >
      <BannerContent>
        <SenderAvatar
          src={notification.senderPicture || "/Images/Default-Avatar.jpg"}
          alt={notification.senderName}
          onError={(e) => {
            e.target.src = "/Images/Default-Avatar.jpg";
          }}
        />

        <TextContent>
          <SenderName>{notification.senderName}</SenderName>
          <MessagePreview>
            {notification.messageType === "image"
              ? "📷 Sent an image"
              : notification.messageType === "file"
              ? "📎 Sent a file"
              : truncateMessage(notification.messagePreview)}
          </MessagePreview>
        </TextContent>

        <ChatIconStyled />

        <CloseButton onClick={handleClose} />
      </BannerContent>
    </BannerWrapper>
  );
};

export default NotificationBanner;
