import express from 'express';
import { Listing } from '../models/Listing.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all listings (filtered by status if query provided)
// @route   GET /api/listings
// @access  Public
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }
    const listings = await Listing.find(filter).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create new listing
// @route   POST /api/listings
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { title, location, price, area, type, description, imageUrl, status } = req.body;
    
    const listing = new Listing({
      title,
      location,
      price,
      area,
      type,
      description,
      imageUrl,
      status,
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update listing status/details
// @route   PUT /api/listings/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      listing.title = req.body.title !== undefined ? req.body.title : listing.title;
      listing.location = req.body.location !== undefined ? req.body.location : listing.location;
      listing.price = req.body.price !== undefined ? req.body.price : listing.price;
      listing.area = req.body.area !== undefined ? req.body.area : listing.area;
      listing.type = req.body.type !== undefined ? req.body.type : listing.type;
      listing.description = req.body.description !== undefined ? req.body.description : listing.description;
      listing.imageUrl = req.body.imageUrl !== undefined ? req.body.imageUrl : listing.imageUrl;
      listing.status = req.body.status !== undefined ? req.body.status : listing.status;

      const updatedListing = await listing.save();
      res.json(updatedListing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete listing
// @route   DELETE /api/listings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      await Listing.deleteOne({ _id: req.params.id });
      res.json({ message: 'Listing removed' });
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
