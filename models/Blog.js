import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a blog title"],
    },
    slug: {
      type: String,
      unique: true,
      required: true,
    },
    content: {
      type: String,
      required: [true, "Please provide blog content"],
    },
    excerpt: {
      type: String,
      maxlength: 300,
      default: "",
    },
    image: {
      type: String, // stores image path or URL
    },
    category: {
      type: String,
      required: true,
      enum: ['Technology', 'Education', 'Health', 'Business', 'Other'],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    metaTitle: {
      type: String,
      maxlength: 60,
      default: "",
    },
    metaDescription: {
      type: String,
      maxlength: 160,
      default: "",
    },
    metaKeywords: {
      type: String,
      default: "", // comma-separated string
    },
    canonicalUrl: {
      type: String,
      default: "",
    },
    ogImage: {
      type: String,
      default: "", // separate OG image if needed
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admin",
    },
  },
  { timestamps: true }
);

export const Blog = mongoose.model("Blog", blogSchema);
