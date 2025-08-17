import axios from "axios"; // import axios for API calls

const url = "http://localhost:8000"; // backend base URL

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
