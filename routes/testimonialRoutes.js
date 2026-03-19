import express from "express";
import {
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";
import { createUpload } from "../config/cloudinary.js";

const router = express.Router();

// ----------------- Cloudinary Upload -----------------
const testimonialUpload = createUpload("testimonials");

// 🔥 Multer + Cloudinary error handler wrapper
const uploadMiddleware = (req, res, next) => {
  const upload = testimonialUpload.single("image");

  upload(req, res, function (err) {
    if (err) {
      console.error("❌ Upload Error:", err);

      return res.status(500).json({
        success: false,
        message: "Image upload failed",
        error: err.message,
      });
    }

    next();
  });
};

// ----------------- ROUTES -----------------

// Public
router.get("/", getTestimonials);

// Admin
router.post(
  "/create",
  isAdminAuthenticated,
  uploadMiddleware, // ✅ wrapped middleware
  addTestimonial
);

router.put(
  "/:id",
  isAdminAuthenticated,
  uploadMiddleware,
  updateTestimonial
);

router.delete("/:id", isAdminAuthenticated, deleteTestimonial);

export default router;