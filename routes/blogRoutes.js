// routes/blogRoutes.js
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
import { createUpload } from "../config/cloudinary.js";  // Cloudinary setup

const router = express.Router();

// Cloudinary upload for blogs
const uploadBlog = createUpload("blogs"); // Cloudinary folder: "blogs"

// ----------------- Public Routes -----------------
router.get("/", getAllBlogs);           // Get all blogs with pagination
router.get("/id/:id", getBlogById);     // Get blog by MongoDB ID
router.get("/:slug", getBlogBySlug);    // Get blog by slug

// ----------------- Protected Routes (Admin) -----------------
router.post("/create", isAdminAuthenticated, uploadBlog.single("image"), createBlog);
router.put("/:id", isAdminAuthenticated, uploadBlog.single("image"), updateBlog);
router.delete("/:id", isAdminAuthenticated, deleteBlog);

export default router;