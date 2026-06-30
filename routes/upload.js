import express from 'express';
import multer from 'multer';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage to avoid saving temporary files to disk
const storage = multer.memoryStorage();

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|webp|mp4|webm|ogg|mov/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = /image|video/.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images (jpg, jpeg, png, webp) or Videos (mp4, webm, ogg, mov) only!'));
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // Guard: Check if Cloudinary credentials are set up
  if (
    !process.env.CLOUDINARY_CLOUD_NAME ||
    process.env.CLOUDINARY_CLOUD_NAME === 'your_cloud_name'
  ) {
    return res.status(400).json({
      message: 'Cloudinary credentials are not configured in backend/.env file.',
    });
  }

  // Stream upload directly from memory buffer to Cloudinary
  const uploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'anil-ashan',
      resource_type: 'auto', // Auto-detect images vs videos
    },
    (error, result) => {
      if (error) {
        console.error('Cloudinary Upload Error:', error);
        return res.status(500).json({
          message: 'Cloudinary upload failed',
          error: error.message,
        });
      }

      // Return the secure cloud URL to be stored in the database
      res.send({
        imageUrl: result.secure_url,
      });
    }
  );

  uploadStream.end(req.file.buffer);
});

export default router;
