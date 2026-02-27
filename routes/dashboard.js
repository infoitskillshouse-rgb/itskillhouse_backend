// routes/dashboard.js
import express from "express";
import Inquiry from "../models/Inquiry.js";
import Blog from "../models/Blog.js";
import Testimonial from "../models/Testimonial.js";
import subscriberModel from '../models/subscriberModel.js'

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const [inquiries, blogs, testimonials,subscriberModel] = await Promise.all([
      Inquiry.countDocuments(),
      Blog.countDocuments(),
      Testimonial.countDocuments(),
    ]);

    res.json({
      inquiries,
      blogs,
      testimonials,
      subscriberModel,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
