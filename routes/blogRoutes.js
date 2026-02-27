  import express from "express";
 import {
  createBlog,
  getAllBlogs,
  getBlogBySlug,
  updateBlog,
  deleteBlog,
  getBlogById,
} from "../controllers/blogController.js";

  import { isAdminAuthenticated } from "../middleware/authMiddleware.js";
  import multer from "multer";
  import path from "path";
  import fs from "fs";

  // Multer config
  const uploadPath = "uploads/blogs/";
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadPath),
    filename: (req, file, cb) =>
      cb(null, `${Date.now()}-${file.originalname}`),
  });
  const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) cb(null, true);
    else cb(new Error("Invalid image format"));
  };

  const upload = multer({ storage, fileFilter });

  const router = express.Router();

  router.get("/", getAllBlogs);
  router.get("/id/:id", getBlogById);
  router.get("/:slug", getBlogBySlug);

  // Protected Routes
  router.post("/", isAdminAuthenticated, upload.single("image"), createBlog);
  router.put("/:id", isAdminAuthenticated, upload.single("image"), updateBlog);
  router.delete("/:id", isAdminAuthenticated, deleteBlog);

  export default router;
