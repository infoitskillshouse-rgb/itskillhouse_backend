import Testimonial from "../models/Testimonial.js";
import fs from "fs";
import path from "path";
import mongoose from "mongoose";

/* ======================
   ADD TESTIMONIAL
====================== */
export const addTestimonial = async (req, res, next) => {
  try {
    const { name, message, rating } = req.body;

    if (!name || !message || rating === undefined) {
      return res.status(400).json({
        success: false,
        message: "Name, message and rating are required",
      });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/testimonials/${req.file.filename}`;

    const testimonial = await Testimonial.create({
      name: name.trim(),
      message: message.trim(),
      rating: numericRating,
      image: imageUrl
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (err) {
    if (req.file) {
      fs.unlinkSync(path.join("uploads/testimonials", req.file.filename));
    }
    next(err);
  }
};

/* ======================
   GET TESTIMONIALS
====================== */
export const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: testimonials,
    });
  } catch (err) {
    next(err);
  }
};

/* ======================
   UPDATE TESTIMONIAL
====================== */
export const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const { name, message, rating } = req.body;

    if (rating !== undefined) {
      const r = Number(rating);
      if (r < 1 || r > 5) {
        return res.status(400).json({
          success: false,
          message: "Rating must be between 1 and 5",
        });
      }
      testimonial.rating = r;
    }

    if (name) testimonial.name = name.trim();
    if (message) testimonial.message = message.trim();

    if (req.file) {
      const oldImg = path.join(
        "uploads/testimonials",
        path.basename(testimonial.image)
      );
      if (fs.existsSync(oldImg)) fs.unlinkSync(oldImg);

      testimonial.image = `/uploads/testimonials/${req.file.filename}`;
    }

    await testimonial.save();

    res.status(200).json({
      success: true,
      data: testimonial,
    });
  } catch (err) {
    next(err);
  }
};

/* ======================
   DELETE TESTIMONIAL
====================== */
export const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid ID" });
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    const imgPath = path.join(
      "uploads/testimonials",
      path.basename(testimonial.image)
    );
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};
