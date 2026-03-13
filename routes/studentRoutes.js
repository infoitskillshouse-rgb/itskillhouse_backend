import express from "express";
import { createUpload } from "../config/cloudinary.js";  // Cloudinary
import {
  createStudent,
  getStudentByStudentId,
  updateStudent,
  deleteStudent,
  getAllStudents
} from "../controllers/studentController.js";
import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Cloudinary upload for students
const uploadStudent = createUpload("students");

// ----------------- ADMIN ROUTES -----------------

// Create student (image required)
router.post(
  "/create",
  isAdminAuthenticated,
  uploadStudent.single("image"),
  createStudent
);

// Get all students
router.get("/", isAdminAuthenticated, getAllStudents);

// Update student (image optional)
router.put(
  "/:studentId",
  isAdminAuthenticated,
  uploadStudent.single("image"),
  updateStudent
);

// Delete student
router.delete("/:studentId", isAdminAuthenticated, deleteStudent);

// ----------------- PUBLIC ROUTE -----------------

// Get single student
router.get("/:studentId", getStudentByStudentId);

export default router;