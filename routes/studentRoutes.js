import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

/* =========================
   MULTER SETUP (INSIDE FILE)
========================= */

const uploadPath = "uploads/students/";

// auto create folder
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files allowed"), false);
  }
};

const upload = multer({ storage, fileFilter });

/* =========================
   CONTROLLERS IMPORT
========================= */

import {
  createStudent,
  getStudentByStudentId,
  updateStudent,
  deleteStudent,
  getAllStudents
} from "../controllers/studentController.js";

import { isAdminAuthenticated } from "../middleware/authMiddleware.js";

/* =========================
   ADMIN ROUTES
========================= */

// Create student (image required)
router.post(
  "/create",
  isAdminAuthenticated,
  upload.single("image"),
  createStudent
);

// Get all
router.get("/", isAdminAuthenticated, getAllStudents);

// Update (image optional)
router.put(
  "/:studentId",
  isAdminAuthenticated,
  upload.single("image"),
  updateStudent
);

// Delete
router.delete("/:studentId", isAdminAuthenticated, deleteStudent);

/* =========================
   PUBLIC ROUTE
========================= */

// Get single student
router.get("/:studentId", getStudentByStudentId);

export default router;
