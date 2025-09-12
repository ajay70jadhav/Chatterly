import axios from "axios"; // import axios for API calls

//const url = "http://localhost:8000"; // backend base URL
const url = "https://chatterly-backend1.onrender.com";

// function to add user by sending POST request
export const addUser = async (data) => {
  try {
    // console.log("📡 Calling addUser API with:", data);
    await axios.post(`${url}/add`, data); // send data to backend
    // console.log("User added successfully"); // success log
  } catch (error) {
    console.log("Error while calling addUser API:", error.message); // error log
  }
};
export const getUsers = async () => {
  try {
    let res = await axios.get(`${url}/users`);
    return res.data;
  } catch (error) {
    console.log(`Error while calling getUsers api`, error.message);
  }
};

export const setConversation = async (data) => {
  try {
    await axios.post(`${url}/conversation/add`, data);
  } catch (error) {
    console.log("Error while calling setConversation api", error.message);
  }
};

export const getConversation = async (data) => {
  try {
    let res = await axios.post(`${url}/conversation/get`, data);
    return res.data;
  } catch (error) {
    console.log("Error while calling getConversation api", error.message);
  }
};
export const newMessage = async (data) => {
  try {
    await axios.post(`${url}/message/add`, data);
  } catch (error) {
    console.log("error while calling newMessage api", error.message);
  }
};

export const getMessages = async (id) => {
  try {
    let res = await axios.get(`${url}/message/get/${id}`);
    return res.data;
  } catch (error) {
    console.log("error while calling getMessages api", error.message);
  }
};
export const uploadFile = async (data) => {
  try {
    return await axios.post(`${url}/file/upload`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (error) {
    console.log("error while calling uploadFile api", error.message);
  }
};
