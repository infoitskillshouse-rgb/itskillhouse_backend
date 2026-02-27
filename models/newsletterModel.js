// models/Newsletter.js
import mongoose from "mongoose";

const newsletterSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
   content: { type: String, required: true }, 
    sentTo: [{ type: String }], 
    status: { type: String, enum: ["sent", "failed"], default: "sent" },
  },
  { timestamps: true }
);

export default mongoose.model("Newsletter", newsletterSchema);
