import mongoose from "mongoose";

const upcomingBatchSchema = new mongoose.Schema(
  {
    courseName: {
      type: String,
      required: true
    },

    courseSlug: {
      type: String,
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    duration: {
      type: String,
      required: true
    },

    timing: {
      type: String
    },

    mode: {
      type: String,
      enum: ["Online", "Offline", "Hybrid"],
      default: "Offline"
    },

    seatsTotal: {
      type: Number,
      default: 30
    },

    seatsLeft: {
      type: Number
    },

    fee: {
      type: Number,
      required: true
    },

    discount: {
      type: Number,
      default: 0   // percentage like 20, 25
    },

    certificate: {
      type: Boolean,
      default: true
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("UpcomingBatch", upcomingBatchSchema);