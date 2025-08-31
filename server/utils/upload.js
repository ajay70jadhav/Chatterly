import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = encodeURIComponent(process.env.DB_PASSWORD);

const storage = new GridFsStorage({
  url: `mongodb://${USERNAME}:${PASSWORD}@ac-7ykq2yl-shard-00-00.jprll0z.mongodb.net:27017,ac-7ykq2yl-shard-00-01.jprll0z.mongodb.net:27017,ac-7ykq2yl-shard-00-02.jprll0z.mongodb.net:27017/?ssl=true&replicaSet=atlas-v65xyo-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Chatterly`,
  options: { useNewUrlParser: true, useUnifiedTopology: true }, // no need for deprecated flags
  file: (req, file) => {
    const match = ["image/png", "image/jpg", "image/jpeg"];

    if (match.indexOf(file.mimetype) === -1) {
      return {
        bucketName: "files",
        filename: `${Date.now()}-file-${file.originalname}`,
      };
    }

    return {
      bucketName: "photos",
      filename: `${Date.now()}-file-${file.originalname}`,
    };
  },
});

export default multer({ storage });
