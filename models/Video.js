import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

export const Video = mongoose.model('Video', videoSchema);
