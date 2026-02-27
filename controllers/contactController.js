import { contactSchema } from '../validators/contactSchema.js';
import nodemailer from 'nodemailer';

export const handleContactForm = async (req, res) => {
  const validation = contactSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: 'Invalid form data', issues: validation.error.issues });
  }

  const { fullName, companyName, email, phone, services, requirements } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      subject: `New Inquiry from ${fullName}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Full Name:</strong> ${fullName}</p>
        <p><strong>Company Name:</strong> ${companyName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Services:</strong> ${services.join(', ')}</p>
        <p><strong>Requirements:</strong><br/>${requirements}</p>
      `,
    });

    res.status(200).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ error: 'Server error, try again later' });
  }
};
