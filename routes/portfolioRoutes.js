import express from "express";
import {
  getPortfolios,
  getPortfolioById,
  createPortfolio,
  updatePortfolio,
  deletePortfolio,
} from "../controllers/portfolioController.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: GET all portfolios
router.get("/", getPortfolios);

// Public: GET single portfolio by ID
router.get("/:id", getPortfolioById);

// Protected/Admin: CREATE a portfolio
router.post("/", isAdminAuthenticated, createPortfolio);

// Protected/Admin: UPDATE a portfolio
router.put("/:id", isAdminAuthenticated, updatePortfolio);

// Protected/Admin: DELETE a portfolio
router.delete("/:id", isAdminAuthenticated, deletePortfolio);

export default router;
