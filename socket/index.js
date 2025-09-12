//==========Updated code==========//
import { Server } from "socket.io";

// Use dynamic port for Render deployment
const PORT = process.env.PORT || 8000; // Render provides PORT, fallback to 8000 locally

// Initialize Socket.IO without a fixed port
const io = new Server({
  cors: {
    origin: "https://chatterllly.netlify.app", // Your Netlify frontend URL
    methods: ["GET", "POST"],
  },
});

console.log(`⚡ Socket.IO server is running on port ${PORT}`);

// Array to store connected users
let users = [];

// Add user to users array if not already added
const addUser = (userData, socketId) => {
  if (!users.some((user) => user.sub === userData.sub)) {
    users.push({ ...userData, socketId });
  }
};

// Get a user by their ID
const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

// Handle socket connections
io.on("connection", (socket) => {
  console.log("👤 User connected with ID:", socket.id);

  // When a new user joins
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    io.emit("getUsers", users); // Send updated users list to all clients
  });

  // When a message is sent
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId);
    if (user) {
      io.to(user.socketId).emit("getMessage", data); // Send message only to receiver
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    users = users.filter((user) => user.socketId !== socket.id);
    io.emit("getUsers", users); // Update all clients
  });
});

// Start Socket.IO server on dynamic port
io.listen(PORT, () => console.log(`🚀 Socket.IO listening on PORT ${PORT}`));

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
