import express from 'express';
import { Inquiry } from '../models/Inquiry.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Submit new inquiry
// @route   POST /api/inquiries
// @access  Public
router.post('/', async (req, res) => {
  try {
    const { name, phone, message } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required' });
    }

    if (!/^\d{10}$/.test(phone.trim())) {
      return res.status(400).json({ message: 'Enter a valid 10-digit number' });
    }

    const inquiry = new Inquiry({
      name: name.trim(),
      phone: phone.trim(),
      message: message ? message.trim() : '',
    });

    const createdInquiry = await inquiry.save();
    res.status(201).json(createdInquiry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete single inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (inquiry) {
      await Inquiry.deleteOne({ _id: req.params.id });
      res.json({ message: 'Inquiry removed' });
    } else {
      res.status(404).json({ message: 'Inquiry not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete all inquiries
// @route   DELETE /api/inquiries
// @access  Private
router.delete('/', protect, async (req, res) => {
  try {
    await Inquiry.deleteMany({});
    res.json({ message: 'All inquiries removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
