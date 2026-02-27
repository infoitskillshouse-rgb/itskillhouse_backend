import express from "express";
import {
  subscribeUser,
  sendNewsletter,
  getAllSubscribers,
  deleteSubscriber,
  getNewsletterStats,
   checkNewsletterStatus
} from "../controllers/newsletterController.js";

const router = express.Router();
router.post("/", subscribeUser);
router.post("/send", sendNewsletter);
router.get("/subscribers", getAllSubscribers);
router.delete("/:id", deleteSubscriber);
router.get("/stats", getNewsletterStats);
router.get("/check", checkNewsletterStatus);

export default router;
