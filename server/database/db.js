import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD); //encode special character
const Connection = async () => {
  const URL = `mongodb://${USERNAME}:${PASSWORD}@ac-7ykq2yl-shard-00-00.jprll0z.mongodb.net:27017,ac-7ykq2yl-shard-00-01.jprll0z.mongodb.net:27017,ac-7ykq2yl-shard-00-02.jprll0z.mongodb.net:27017/?ssl=true&replicaSet=atlas-v65xyo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Chatterly`;
  try {
    await mongoose.connect(URL);
    console.log("database connected successfully");
  } catch (error) {
    console.log("Error while connecting with the database", error.message);
  }
};
export default Connection;
