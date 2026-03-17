import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

if (
  !process.env.CLOUD_NAME ||
  !process.env.CLOUD_API_KEY ||
  !process.env.CLOUD_API_SECRET
) {
  throw new Error("❌ Cloudinary ENV variables missing");
}

// ✅ Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// 🔥 Storage Creator with Error Safety
export const createStorage = (folderName) => {
  try {
    return new CloudinaryStorage({
      cloudinary,
      params: async (req, file) => {
        console.log("📁 Uploading file:", file.originalname);

        return {
          folder: folderName,
          resource_type: "image",
        };
      },
    });
  } catch (err) {
    console.error("❌ Storage Creation Error:", err);
    throw err;
  }
};

// 🔥 Multer Upload Creator with Error Handling
export const createUpload = (folderName) => {
  try {
    const storage = createStorage(folderName);

    return multer({
      storage,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (req, file, cb) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/jpg",
          "image/avif",
          "image/svg+xml",
        ];

        if (allowedTypes.includes(file.mimetype)) {
          cb(null, true);
        } else {
          console.error("❌ Invalid file type:", file.mimetype);
          cb(new Error("Only image files are allowed"), false);
        }
      },
    });
  } catch (err) {
    console.error("❌ Multer Setup Error:", err);
    throw err;
  }
};

export default cloudinary;