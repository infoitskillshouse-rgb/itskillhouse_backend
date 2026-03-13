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
const testimonialUpload = createUpload("testimonials"); // Cloudinary folder: 'testimonials'

// Public
router.get("/", getTestimonials);

// Admin
router.post(
  "/create",
  isAdminAuthenticated,
  testimonialUpload.single("image"), // single image upload
  addTestimonial
);

router.put(
  "/:id",
  isAdminAuthenticated,
  testimonialUpload.single("image"),
  updateTestimonial
);

router.delete("/:id", isAdminAuthenticated, deleteTestimonial);

export default router;