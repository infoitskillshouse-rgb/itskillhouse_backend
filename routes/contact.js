// routes/contact.js
import express from 'express';
import Inquiry from '../models/Inquiry.js';

const router = express.Router();

// Submit Inquiry (Already present)
router.post('/', async (req, res) => {
  try {
    const inquiry = new Inquiry(req.body);
    await inquiry.save();
    res.status(201).json({ message: 'Inquiry submitted successfully' });
  } catch (error) {
    console.error('Failed to submit inquiry:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get All Inquiries (Admin Panel)
router.get('/', async (req, res) => {
  try {
    const allInquiries = await Inquiry.find().sort({ createdAt: -1 });
    res.status(200).json(allInquiries);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch inquiries' });
  }
});

// Delete Inquiry by ID
router.delete('/:id', async (req, res) => {
  try {
    await Inquiry.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Inquiry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete inquiry' });
  }
});

export default router;
