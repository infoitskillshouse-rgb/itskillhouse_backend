import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Function to create storage per folder
export const createStorage = (folderName) => {
  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: folderName,  // dynamic folder name
      allowed_formats: ["jpg", "png", "jpeg","avif","svg"],
    },
  });
};

// Function to create multer upload
export const createUpload = (folderName) => multer({ storage: createStorage(folderName) });

export default cloudinary;