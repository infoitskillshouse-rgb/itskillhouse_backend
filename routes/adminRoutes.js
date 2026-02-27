import express from "express";
import {

  loginAdmin,
  forgotPassword,
  resetPassword,
  getAdminProfile,
  updateAdminProfile,
  changePassword,
  createAdmin

} from "../controllers/adminController.js";

import {
  isAdminAuthenticated
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", loginAdmin);

router.post("/forgot-password", forgotPassword);

router.put("/reset-password/:token", resetPassword);

router.get("/me",
  isAdminAuthenticated,
  getAdminProfile
);

router.put("/update-profile",
  isAdminAuthenticated,
  updateAdminProfile
);

router.put("/change-password",
  isAdminAuthenticated,
  changePassword
);

router.post("/create-admin",
  isAdminAuthenticated,
  createAdmin
);

export default router;