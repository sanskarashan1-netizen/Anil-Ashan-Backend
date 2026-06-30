import express from 'express';
import { Video } from '../models/Video.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get walkthrough videos
// @route   GET /api/videos
// @access  Public
router.get('/', async (req, res) => {
  try {
    const videos = await Video.find({});
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a walkthrough video url
// @route   PUT /api/videos/:key
// @access  Private
router.put('/:key', protect, async (req, res) => {
  try {
    const { url, title } = req.body;
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }

    const video = await Video.findOne({ key: req.params.key });
    if (video) {
      video.url = url;
      if (title) video.title = title;
      const updatedVideo = await video.save();
      res.json(updatedVideo);
    } else {
      res.status(404).json({ message: 'Video setting not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Create a walkthrough video
// @route   POST /api/videos
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, url, key } = req.body;
    if (!title || !url) {
      return res.status(400).json({ message: 'Title and URL are required' });
    }
    const finalKey = key || `video_${Date.now()}`;
    const video = new Video({
      key: finalKey,
      title,
      url
    });
    const createdVideo = await video.save();
    res.status(201).json(createdVideo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a walkthrough video
// @route   DELETE /api/videos/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (video) {
      await Video.deleteOne({ _id: req.params.id });
      res.json({ message: 'Video removed' });
    } else {
      res.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
