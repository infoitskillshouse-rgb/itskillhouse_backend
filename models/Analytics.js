// models/Analytics.js
import mongoose from "mongoose";

const analyticsSchema = new mongoose.Schema(
  {
    totalSubscribers: Number,
    newslettersSent: Number,
    lastSentAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Analytics", analyticsSchema);
