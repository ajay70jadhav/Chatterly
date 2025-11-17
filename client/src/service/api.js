import axios from "axios"; // HTTP client for making API requests to backend

// Backend API base URL - change to localhost for development
// Currently pointing to deployed backend on Render
const url = "https://chatterly-backend1.onrender.com";

// ===================== USER MANAGEMENT =====================
// Adds a new user to the database after Google OAuth login
export const addUser = async (data) => {
  try {
    // Posts user profile data (name, email, picture, Google ID) to backend
    await axios.post(`${url}/add`, data);
  } catch (error) {
    console.log("Error while calling addUser API:", error.message);
  }
};

// Retrieves list of all registered users (excluding current user)
export const getUsers = async () => {
  try {
    let res = await axios.get(`${url}/users`);
    return res.data;
  } catch (error) {
    console.log(`Error while calling getUsers api`, error.message);
  }
};

// ===================== CONVERSATION MANAGEMENT =====================
// Creates a new conversation between two users
export const setConversation = async (data) => {
  try {
    // Creates conversation record in database with sender/receiver IDs
    await axios.post(`${url}/conversation/add`, data);
  } catch (error) {
    console.log("Error while calling setConversation api", error.message);
  }
};

// Retrieves existing conversation between two users
export const getConversation = async (data) => {
  try {
    let res = await axios.post(`${url}/conversation/get`, data);
    return res.data;
  } catch (error) {
    console.log("Error while calling getConversation api", error.message);
  }
};

// ===================== FILE SHARING (DISABLED) =====================
// Uploads files to MongoDB GridFS storage (currently commented out)
export const uploadFile = async (data) => {
  try {
    return await axios.post(`${url}/file/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.log("error while calling uploadFile api", error.message);
  }
};

// ===================== MESSAGE HANDLING =====================
// Saves new message to database
export const newMessage = async (data) => {
  try {
    // Stores message with sender, receiver, conversation ID, and message content
    await axios.post(`${url}/message/add`, data);
  } catch (error) {
    console.log("error while calling newMessage api", error.message);
  }
};

// Retrieves all messages for a specific conversation
export const getMessages = async (id) => {
  try {
    let res = await axios.get(`${url}/message/get/${id}`);
    return res.data;
  } catch (error) {
    console.log("error while calling getMessages api", error.message);
  }
};
