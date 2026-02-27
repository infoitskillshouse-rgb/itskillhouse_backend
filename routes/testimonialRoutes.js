import express from "express";
import {
  addTestimonial,
  getTestimonials,
  updateTestimonial,
  deleteTestimonial,
} from "../controllers/testimonialController.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";
import { testimonialUpload } from "../middleware/testimonialUpload.js";

const router = express.Router();

// Public
router.get("/", getTestimonials);

// Admin
router.post(
  "/create",
  isAdminAuthenticated,
  testimonialUpload.single("image"),
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
