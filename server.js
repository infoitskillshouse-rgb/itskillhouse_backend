import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { sanitizeBody } from './utils/sanitizeInput.js';
import connectDB from "./config/db.js";

import adminRoutes from "./routes/adminRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import newsletterRoutes from "./routes/newsletterRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import testimonialRoutes from './routes/testimonialRoutes.js';
import studentRotes from './routes/studentRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js'
import batchRoutes from "./routes/batchRoutes.js";


import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();
app.use("/uploads", express.static("uploads"));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(helmet());
app.use(sanitizeBody);
app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin:  process.env.CLIENT_URL,
  credentials: true,
}))
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Try later.",
});
app.use("/api/admin/login", loginLimiter);

app.use("/api/admin", adminRoutes);
app.use("/api/inquiries", inquiryRoutes);  
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/blogs", blogRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/students',studentRotes );
app.use('/api/portfolios',portfolioRoutes );
app.use("/api/batches", batchRoutes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5000;
app.listen(PORT);
