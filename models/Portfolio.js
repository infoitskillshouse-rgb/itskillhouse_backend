import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    // Admin title of the portfolio project
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Image URL or path
    image: {
      type: String,
      required: true,
      trim: true,
    },

    // Category (Web, Mobile, Design, etc.)
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Optional description
    description: {
      type: String,
      trim: true,
    },

    // Optional project URL/demo link
    projectLink: {
      type: String,
      trim: true,
    },

    // Optional list of technologies
    technologies: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Portfolio = mongoose.models.Portfolio || mongoose.model("Portfolio", portfolioSchema);

export default Portfolio;
