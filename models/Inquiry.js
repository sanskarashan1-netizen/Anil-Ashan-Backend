import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    default: () => new Date().toLocaleString('en-IN'),
  }
}, {
  timestamps: true,
});

export const Inquiry = mongoose.model('Inquiry', inquirySchema);
