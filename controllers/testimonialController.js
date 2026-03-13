import Testimonial from "../models/Testimonial.js";

/* ======================
   ADD TESTIMONIAL
====================== */
export const addTestimonial = async (req, res, next) => {
  try {
    const { name, message, rating } = req.body;

    // Required fields check
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

    // Cloudinary image URL handling
    let imageUrl = "";
    if (req.file?.path) {
      imageUrl = req.file.path;  // uploaded via Cloudinary
    } else if (req.body.image) {
      imageUrl = req.body.image; // sent as JSON URL
    } else {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    // Create testimonial
    const testimonial = await Testimonial.create({
      name: name.trim(),
      message: message.trim(),
      rating: numericRating,
      image: imageUrl,
    });

    res.status(201).json({
      success: true,
      data: testimonial,
    });
  } catch (err) {
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

    // Cloudinary image update
    if (req.file?.path) {
      testimonial.image = req.file.path;
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

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: "Testimonial not found",
      });
    }

    await testimonial.deleteOne();

    res.status(200).json({
      success: true,
      message: "Testimonial deleted successfully",
    });
  } catch (err) {
    next(err);
  }
};