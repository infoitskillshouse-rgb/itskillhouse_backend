import express from 'express';
import { createInquiry } from '../controllers/inquiryController.js';

const router = express.Router();

router.post('/contact', createInquiry); // ✅ No auth required

export default router;
