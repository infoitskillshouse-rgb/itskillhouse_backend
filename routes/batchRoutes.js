import express from "express";
import {
  createBatch,
  getBatches,
  getBatchById,
  updateBatch,
  deleteBatch
} from "../controllers/batchController.js";

import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();


// PUBLIC ROUTES (students / website users)
router.get("/", getBatches);
router.get("/:id", getBatchById);


// ADMIN ROUTES
router.post("/create", isAdminAuthenticated, createBatch);
router.put("/:id", isAdminAuthenticated, updateBatch);
router.delete("/:id", isAdminAuthenticated, deleteBatch);


export default router;