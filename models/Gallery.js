import mongoose from 'mongoose';

const gallerySchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    default: 'gallery'
  },
  images: {
    type: [String],
    default: [
      '/1.png',
      '/111.png',
      '/13.png',
      '/15.png',
      '/17.png',
      '/10.png',
      '/11.png',
      '/12.png'
    ]
  },
  showcaseImg: {
    type: String,
    default: '/8.png'
  }
}, {
  timestamps: true,
});

export const Gallery = mongoose.model('Gallery', gallerySchema);
