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

// Array to store connected users
let users = [];

// Function to add a user if not already connected
const addUser = (userData, socketId) => {
  // Check if user already exists by their 'sub' ID
  if (!users.some((user) => user.sub === userData.sub)) {
    // Add user to users array with their socketId
    users.push({ ...userData, socketId });
  }
};

// Function to get a user by their ID
const getUser = (userId) => {
  return users.find((user) => user.sub === userId);
};

// Listen for new socket connections
io.on("connection", (socket) => {
  console.log("👤 User connected with ID:", socket.id);

  // Event: Add a new user to the users list
  socket.on("addUsers", (userData) => {
    addUser(userData, socket.id);
    // Emit updated users list to all connected clients
    io.emit("getUsers", users);
  });

  // Event: Send a message from one user to another
  socket.on("sendMessage", (data) => {
    const user = getUser(data.receiverId); // Find receiver by ID
    if (user) {
      // Send the message only to the receiver's socket
      io.to(user.socketId).emit("getMessage", data);
    }
  });

  // Event: Handle user disconnect
  socket.on("disconnect", () => {
    // Remove user from users array
    users = users.filter((user) => user.socketId !== socket.id);
    // Update all clients with new users list
    io.emit("getUsers", users);
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
