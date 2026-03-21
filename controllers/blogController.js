import { Blog } from "../models/Blog.js";


export const createBlog = async (req, res) => {
  try {

    const {
      title,
      content,
      category,
      slug,
      status = "draft",
      excerpt = "",
      tags = [],
      metaTitle = "",
      metaDescription = "",
      metaKeywords = "",
      canonicalUrl = "",
      ogImage = "",
    } = req.body;


    // 2️⃣ Validate required fields
    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!content) missingFields.push("content");
    if (!category) missingFields.push("category");
    if (!slug) missingFields.push("slug");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missingFields.join(", ")}`,
      });
    }

    // 3️⃣ Ensure tags is an array
    let parsedTags = [];
    if (Array.isArray(tags)) parsedTags = tags;
    else if (typeof tags === "string") parsedTags = tags.split(",").map(t => t.trim());

    const image = req.file?.path || "";
    

    // 5️⃣ Slug uniqueness check
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(409).json({
        success: false,
        message: "Slug already exists. Please use a unique slug.",
      });
    }

    // 6️⃣ Create blog document
    const blog = new Blog({
      title,
      content,
      category,
      slug,
      status,
      excerpt,
      tags: parsedTags,
      metaTitle,
      metaDescription,
      metaKeywords,
      canonicalUrl,
      ogImage,
      image,
    });

    // 7️⃣ Save to DB
    await blog.save();

    // 8️⃣ Success response
    return res.status(201).json({
      success: true,
      message: "Blog created successfully",
      data: blog,
    });
  } catch (err) {


    // 9️⃣ Error type detection (optional)
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: err.errors, // Mongoose validation details
      });
    }

    // 10️⃣ Default 500
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating the blog",
      error: err.message,
    });
  }
};
// ----------------- GET ALL BLOGS (with pagination & search) -----------------
export const getAllBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const keyword = req.query.keyword || "";

    const query = keyword
      ? { title: { $regex: keyword, $options: "i" } }
      : {};

    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({ success: true, blogs, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------- GET BLOG BY SLUG -----------------
export const getBlogBySlug = async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------- GET BLOG BY ID -----------------
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------- UPDATE BLOG -----------------
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
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.status =
  typeof status === "object" ? status.value : status || blog.status;
    blog.slug = slug || blog.slug;
    blog.excerpt = excerpt || blog.excerpt;
    blog.tags = tags
      ? typeof tags === "string"
        ? tags.split(",").map(t => t.trim())
        : tags
      : blog.tags;
    blog.metaTitle = metaTitle || blog.metaTitle;
    blog.metaDescription = metaDescription || blog.metaDescription;
    blog.metaKeywords = metaKeywords || blog.metaKeywords;
    blog.canonicalUrl = canonicalUrl || blog.canonicalUrl;
    blog.ogImage = ogImage || blog.ogImage;
    blog.category = category || blog.category;

    // Update image if uploaded
    if (req.file?.path) {
      blog.image = req.file.path;
    }

    await blog.save();
    res.json({ success: true, data: blog });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ----------------- DELETE BLOG -----------------
export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ success: false, message: "Blog not found" });

    await blog.deleteOne();
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
