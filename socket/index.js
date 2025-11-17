// Import necessary modules
import { createServer } from "http"; // To create an HTTP server
import { Server } from "socket.io"; // Socket.IO server

// Use dynamic port: Render provides process.env.PORT, fallback to 9000 for local testing
const PORT = process.env.PORT || 9000;

// Create an HTTP server instance
const httpServer = createServer();

// Initialize Socket.IO server
// We need to configure CORS so that frontend can connect
const io = new Server(httpServer, {
  cors: {
    // Allow both local frontend and deployed frontend to connect
    origin: ["http://localhost:5173", "https://chatterllly.netlify.app"],
    methods: ["GET", "POST"], // Only allow GET and POST requests
  },
});

// Log that server is starting
console.log(`⚡ Socket.IO server will run on port ${PORT}`);

// Map to store connected users with socketId as key
// onlineUsers[userId] = { socketId, userData }
let onlineUsers = new Map();

// Array to store offline notifications for users
// offlineNotifications[userId] = [{ senderId, senderName, messagePreview, chatId, timestamp }]
let offlineNotifications = new Map();

// Function to add a user to online users map
const addUser = (userData, socketId) => {
  const userId = userData.sub;
  onlineUsers.set(userId, { socketId, userData });

  // Remove any existing offline notifications for this user
  if (offlineNotifications.has(userId)) {
    offlineNotifications.delete(userId);
  }
};

// Function to get a user by their ID
const getUser = (userId) => {
  return onlineUsers.get(userId);
};

// Function to check if user is online
const isUserOnline = (userId) => {
  return onlineUsers.has(userId);
};

// Function to store offline notification
const storeOfflineNotification = (receiverId, notificationData) => {
  if (!offlineNotifications.has(receiverId)) {
    offlineNotifications.set(receiverId, []);
  }

  const notifications = offlineNotifications.get(receiverId);
  notifications.push({
    ...notificationData,
    timestamp: new Date().toISOString(),
  });

  // Keep only last 50 notifications per user to prevent memory issues
  if (notifications.length > 50) {
    notifications.shift();
  }
};

// Function to get offline notifications for a user
const getOfflineNotifications = (userId) => {
  return offlineNotifications.get(userId) || [];
};

// Listen for new socket connections
io.on("connection", (socket) => {
  console.log("👤 User connected with ID:", socket.id);

  // Event: Add a new user to the users list
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);

    // Convert Map to Array for backwards compatibility
    const usersArray = Array.from(onlineUsers.values()).map((entry) => entry.userData);
    io.emit("getUsers", usersArray);

    // Send offline notifications if any
    const offlineNotifs = getOfflineNotifications(userData.sub);
    if (offlineNotifs.length > 0) {
      socket.emit("getOfflineNotifications", offlineNotifs);
    }
  });

  // Event: Send a message from one user to another
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId); // Find receiver by ID
    if (user) {
      // Send the message only to the receiver's socket
      io.to(user.socketId).emit("getMessage", data);

      // Send notification to receiver if they're online and not the sender
      if (user.userData.sub !== data.senderId) {
        io.to(user.socketId).emit("newMessageNotification", {
          senderId: data.senderId,
          senderName: data.senderName,
          messagePreview: data.text || "Sent a file/image",
          messageType: data.type,
          chatId: data.conversationId,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // User is offline, store notification
      storeOfflineNotification(data.receiverId, {
        senderId: data.senderId,
        senderName: data.senderName,
        messagePreview: data.text || "Sent a file/image",
        messageType: data.type,
        chatId: data.conversationId,
      });
    }
  });

  // Event: Handle user disconnect
  socket.on("disconnect", () => {
    // Remove user from online users map
    for (const [userId, userData] of onlineUsers) {
      if (userData.socketId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }

    // Convert Map to Array for backwards compatibility
    const usersArray = Array.from(onlineUsers.values()).map((entry) => entry.userData);
    io.emit("getUsers", usersArray);
  });
});

// Start the HTTP server to listen on the specified port
httpServer.listen(PORT, () => console.log(`🚀 Socket.IO listening on PORT ${PORT}`));

//////////////////////////////////////////////
//============ OLD CODE==========//
/*
import { Server } from "socket.io";

const io = new Server(9000, {
  cors: { origin: "http://localhost:5173" },
});
console.log("Socket server is running on port 9000");

let users = [];

const addUser = (userData, socketId) => {
  !users.some((user) => user.sub == userData.sub) && users.push({ ...userData, socketId });
};

const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

io.on("connection", (socket) => {
  console.log("user connected with ID:", socket.id);
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users);
  });
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    io.to(user.socketId).emit("getMessage", data);
  });
});


*/
