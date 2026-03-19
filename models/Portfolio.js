import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
      trim: true,
    },


    category: {
      type: String,
      required: true,
      trim: true,
    },

 
    description: {
      type: String,
      trim: true,
    },


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
