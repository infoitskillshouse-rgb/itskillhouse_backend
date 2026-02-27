import mongoose from "mongoose";
import crypto from "crypto";

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      unique: true,
      index: true, // Ensure index
      sparse: true // Allows null for old documents
    },
    name: { type: String, required: [true, "Name is required"], trim: true },
        courseName: { type: String, required: [true, "Course Name is required"], trim: true },
    fatherName: { type: String, required: [true, "Father Name is required"], trim: true },
    motherName: { type: String, required: [true, "Mother Name is required"], trim: true },
    totalMarks: { type: Number, required: [true, "Total Marks required"] },
    obtainedMarks: { type: Number, required: [true, "Obtained Marks required"] },
    percentage: { type: Number, required: [true, "Percentage required"] },
    grade: { type: String, required: [true, "Grade required"], trim: true },
    result: { type: String, enum: ["pass", "fail"], required: [true, "Result required"] },
    courseDuration: { type: String, required: [true, "Course Duration required"] },
    image: { type: String, required: [true, "Image URL required"] },
    dateOfAdmission: { type: Date, required: [true, "Date of Admission required"] },
    isDeleted: { type: Boolean, default: false, select: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (doc, ret) => {
        delete ret._id;
        delete ret.isDeleted;
        return ret;
      }
    }
  }
);


// ------------------------
// Query helper
// ------------------------
studentSchema.query.notDeleted = function () {
  return this.where({ isDeleted: false });
};

// ------------------------
const Student = mongoose.model("Student", studentSchema);
export default Student;
