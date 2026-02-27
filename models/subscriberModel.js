import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  interest: [String],
  isVerified: { type: Boolean, default: true }, // Future use
}, { timestamps: true });

export default mongoose.model("Subscriber", subscriberSchema);
