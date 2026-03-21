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
import { createUpload } from "../config/cloudinary.js";

const router = express.Router();

// Cloudinary upload
const blogUpload = createUpload("blogs");

// ✅ SAME wrapper like portfolio
const uploadMiddleware = (req, res, next) => {
  const upload = blogUpload.single("image");

  upload(req, res, function (err) {
    if (err) {
      console.error("❌ Blog Upload Error:", err);

      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: err.message,
      });
    }

    next();
  });
};

// ----------------- Public Routes -----------------
router.get("/", getAllBlogs);
router.get("/id/:id", getBlogById);
router.get("/:slug", getBlogBySlug);

// ----------------- Protected Routes -----------------
router.post("/create", isAdminAuthenticated, uploadMiddleware, createBlog);

router.put("/:id", isAdminAuthenticated, uploadMiddleware, updateBlog);

router.delete("/:id", isAdminAuthenticated, deleteBlog);

export default router;