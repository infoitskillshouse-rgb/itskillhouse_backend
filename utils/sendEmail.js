// utils/sendEmail.js
import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App Password use karna
      },
    });

    const info = await transporter.sendMail({
      from: `"Newsletter Team" <${process.env.EMAIL_USER}>`,
      to: Array.isArray(to) ? to.join(",") : to, // ✅ multiple emails handle
      subject,
      html,
    });

    console.log("Email sent:", info.messageId);
    return info;
  } catch (error) {
    console.error("Send Email Error:", error);
    throw error;
  }
};

export default sendEmail;
