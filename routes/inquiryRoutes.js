import express from "express";
import {
  createInquiry,
  getAllInquiries,
  getInquiryById,
  deleteInquiry,
  updateInquiry ,
} from "../controllers/inquiryController.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", createInquiry); // public
router.get("/", isAdminAuthenticated, getAllInquiries); // admin only
router.get("/:id", isAdminAuthenticated, getInquiryById);
router.delete("/:id", isAdminAuthenticated, deleteInquiry);
router.put("/:id", isAdminAuthenticated, updateInquiry);

export default router;
