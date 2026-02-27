import multer from "multer";
import path from "path";
import fs from "fs";

const uploadPath = "uploads/students/";

// folder auto create
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only images allowed (jpg, jpeg, png, webp)"), false);
  }
};

const studentUpload = multer({ storage, fileFilter });

export default studentUpload;
