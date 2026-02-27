import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/blogs/";
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  cb([".jpg", ".jpeg", ".png", ".webp"].includes(ext) ? null : new Error("Invalid file type"), true);
};

export const blogUpload = multer({ storage, fileFilter });
