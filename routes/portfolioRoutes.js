import express from "express";
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolioController.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";
import { createUpload } from "../config/cloudinary.js";

const router = express.Router();

// ----------------- Cloudinary Upload -----------------
const portfolioUpload = createUpload("portfolios");

// 🔥 Multer + Cloudinary error handler wrapper
const uploadMiddleware = (req, res, next) => {
  const upload = portfolioUpload.single("image");

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
router.get("/", getPortfolios);
router.get("/:id", getPortfolioById);

// Admin
router.post(
  "/create",
  uploadMiddleware,
  isAdminAuthenticated,// ✅ same as testimonials
  createPortfolio
);

router.put(
  "/:id",
  isAdminAuthenticated,
  uploadMiddleware,
  updatePortfolio
);

router.delete("/:id", isAdminAuthenticated, deletePortfolio);

export default router;