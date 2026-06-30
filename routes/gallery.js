import express from 'express';
import { Gallery } from '../models/Gallery.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get gallery settings
// @route   GET /api/gallery
// @access  Public
router.get('/', async (req, res) => {
  try {
    let gallery = await Gallery.findOne({ key: 'gallery' });
    if (!gallery) {
      // Seed default gallery
      gallery = await Gallery.create({
        key: 'gallery',
        images: [
          '/1.png',
          '/111.png',
          '/13.png',
          '/15.png',
          '/17.png',
          '/10.png',
          '/11.png',
          '/12.png'
        ],
        showcaseImg: '/8.png'
      });
    }
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update gallery settings
// @route   PUT /api/gallery
// @access  Private
router.put('/', protect, async (req, res) => {
  try {
    const { images, showcaseImg } = req.body;
    let gallery = await Gallery.findOne({ key: 'gallery' });
    if (gallery) {
      if (images) gallery.images = images;
      if (showcaseImg) gallery.showcaseImg = showcaseImg;
      const updatedGallery = await gallery.save();
      res.json(updatedGallery);
    } else {
      // Create if doesn't exist
      const newGallery = await Gallery.create({
        key: 'gallery',
        images: images || [],
        showcaseImg: showcaseImg || '/8.png'
      });
      res.json(newGallery);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
