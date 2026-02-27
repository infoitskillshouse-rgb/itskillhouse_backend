import mongoose from "mongoose";

const inquirySchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  companyName: String,
  email: { type: String, required: true },
  phone: { type: String, required: true },
  services: [String],
  requirements: String,
  createdAt: { type: Date, default: Date.now },
});

const Inquiry = mongoose.model("Inquiry", inquirySchema);
export default Inquiry;
