import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    default: '',
  },
  price: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  imageUrl: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['Available', 'Sold'],
    default: 'Available',
  },
  date: {
    type: String,
    default: () => new Date().toLocaleDateString('en-IN'),
  }
}, {
  timestamps: true,
});

export const Listing = mongoose.model('Listing', listingSchema);
