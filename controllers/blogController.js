import { Blog } from "../models/Blog.js";
import fs from "fs";

// CREATE
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      category,
      slug,
      status,
      excerpt,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogImage,
    } = req.body;

    const image = req.file?.filename;

    const blog = new Blog({
      title,
      content,
      category,
      slug,
      status,
      excerpt,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogImage,
      image,
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// GET ALL with pagination
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    const query = {
      title: { $regex: keyword, $options: "i" },
    };

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY SLUG
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET BY ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE
export const updateBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      status,
      slug,
      excerpt,
      tags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogImage,
      category,
    } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.status = status || blog.status;
    blog.slug = slug || blog.slug;
    blog.excerpt = excerpt || blog.excerpt;
    blog.tags = tags || blog.tags;
    blog.metaTitle = metaTitle || blog.metaTitle;
    blog.metaDescription = metaDescription || blog.metaDescription;
    blog.metaKeywords = metaKeywords || blog.metaKeywords;
    blog.canonicalUrl = canonicalUrl || blog.canonicalUrl;
    blog.ogImage = ogImage || blog.ogImage;
    blog.category = category || blog.category;

    if (req.file) {
      if (blog.image && fs.existsSync(`uploads/blogs/${blog.image}`)) {
        fs.unlinkSync(`uploads/blogs/${blog.image}`);
      }
      blog.image = req.file.filename;
    }

    await blog.save();
    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Not found" });

    if (blog.image && fs.existsSync(`uploads/blogs/${blog.image}`)) {
      fs.unlinkSync(`uploads/blogs/${blog.image}`);
    }

    await blog.deleteOne();

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
