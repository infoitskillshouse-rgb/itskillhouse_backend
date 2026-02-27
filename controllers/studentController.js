import Student from "../models/studentModel.js";
import fs from "fs";
import path from "path";

/* =========================
   Course Codes Mapping
========================= */
const courseCodes = {
  "Full Stack Development": "FSD",
  "Basic Computer": "BC",
  "Basic Computer  & Typing ": "BCT",
  "Website Development": "WD",
  "Website Designing": "WDS",
  "WordPress": "WP",
  "Digital Marketing": "DM",
  "Java Training": "JAVA",
  "Python Training": "PY",
  "Php": "PHP",
  "Tally": "TALLY",
  "Tally (GST + Return)": "TGR",
  "Tally Prime": "TPO",
  "Punjabi Typing": "PT",
  "Hindi Typing": "HT",
};
   
/* =========================
   Generate Student ID (SAFE)
========================= */
const generateStudentId = async (courseName) => {
  const year = new Date().getFullYear();
  const code = courseCodes[courseName] || "GEN";

  const last = await Student.findOne({
    studentId: new RegExp(`^${year}-${code}-`)
  }).sort({ studentId: -1 });

  const nextSeq = last
    ? parseInt(last.studentId.split("-")[2], 10) + 1
    : 1;

  return `${year}-${code}-${String(nextSeq).padStart(2, "0")}`;
};

/* =========================
   CREATE STUDENT
========================= */
export const createStudent = async (req, res, next) => {
  try {
    const {
      name,
      fatherName,
      motherName,
      courseName,
      courseDuration,
      totalMarks,
      obtainedMarks,
      dateOfAdmission,
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Student image is required" });
    }

    if (
      !name ||
      !fatherName ||
      !motherName ||
      !courseName ||
      !courseDuration
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const total = Number(totalMarks);
    const obtained = Number(obtainedMarks);
    const admissionDate = new Date(dateOfAdmission);

    if (
      isNaN(total) ||
      isNaN(obtained) ||
      total <= 0 ||
      obtained < 0 ||
      obtained > total ||
      isNaN(admissionDate.getTime())
    ) {
      return res.status(400).json({ message: "Invalid academic data" });
    }

    const percentage = ((obtained / total) * 100).toFixed(2);

    let grade = "F";
    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B";
    else if (percentage >= 60) grade = "C";
    else if (percentage >= 50) grade = "D";

    const result = percentage >= 40 ? "pass" : "fail";

    const exists = await Student.findOne({
      name: name.trim(),
      fatherName: fatherName.trim(),
      courseName,
      dateOfAdmission: admissionDate,
      isDeleted: false,
    });

    if (exists) {
      return res.status(409).json({ message: "Student already exists" });
    }

    const studentId = await generateStudentId(courseName);

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/students/${req.file.filename}`;

    const student = await Student.create({
      studentId,
      name: name.trim(),
      fatherName: fatherName.trim(),
      motherName: motherName.trim(),
      courseName,
      courseDuration,
      totalMarks: total,
      obtainedMarks: obtained,
      percentage,
      grade,
      result,
      dateOfAdmission: admissionDate,
      image: imageUrl,
    });

    res.status(201).json({
      message: "Student created successfully",
      student,
    });
  } catch (err) {
    if (req.file) {
      const imgPath = path.join("uploads/students", req.file.filename);
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }
    next(err);
  }
};

/* =========================
   GET STUDENT BY ID
========================= */
export const getStudentByStudentId = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json({ student });
  } catch (err) {
    next(err);
  }
};

/* =========================
   UPDATE STUDENT
========================= */
export const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    if (req.file) {
      const oldPath = path.join(
        "uploads/students",
        path.basename(student.image)
      );
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

      student.image = `${req.protocol}://${req.get("host")}/uploads/students/${req.file.filename}`;
    }

    const allowedFields = [
      "name",
      "fatherName",
      "motherName",
      "courseName",
      "courseDuration",
      "totalMarks",
      "obtainedMarks",
      "dateOfAdmission",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        student[field] = req.body[field];
      }
    });

    await student.save();

    res.json({
      message: "Student updated successfully",
      student,
    });
  } catch (err) {
    next(err);
  }
};

/* =========================
   DELETE STUDENT (SOFT)
========================= */
export const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findOne({
      studentId: req.params.studentId,
      isDeleted: false,
    });

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const imgPath = path.join(
      "uploads/students",
      path.basename(student.image)
    );
    if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);

    student.isDeleted = true;
    await student.save();

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    next(err);
  }
};

/* =========================
   GET ALL STUDENTS (PAGINATED)
========================= */
export const getAllStudents = async (req, res, next) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find({ isDeleted: false })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Student.countDocuments({ isDeleted: false }),
    ]);

    res.json({
      total,
      page,
      pages: Math.ceil(total / limit),
      students,
    });
  } catch (err) {
    next(err);
  }
};
