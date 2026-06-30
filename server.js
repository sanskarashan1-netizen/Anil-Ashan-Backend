import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { Listing } from './models/Listing.js';
import { Video } from './models/Video.js';
import { User } from './models/User.js';
import authRoutes from './routes/auth.js';
import listingRoutes from './routes/listings.js';
import inquiryRoutes from './routes/inquiries.js';
import uploadRoutes from './routes/upload.js';
import videoRoutes from './routes/videos.js';
import galleryRoutes from './routes/gallery.js';

dotenv.config();

// Fix for ES module directory names
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads folder if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Create public folder for default assets if it doesn't exist
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' })); // Support base64 listing uploads too
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploaded files
app.use('/uploads', express.static(uploadsDir));
// Serve default assets (images, videos)
app.use(express.static(publicDir));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/gallery', galleryRoutes);

// Simple healthcheck
app.get('/', (req, res) => {
  res.send('Anil Ashan Real Estate API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const seedListings = async () => {
  try {
    const count = await Listing.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default property listings...');
      const defaultListings = [
        {
          title: 'Shiv Prasad Apartment',
          location: 'Airoli, Mumbai',
          price: '16.5K/sq.ft',
          area: '651 - 842 sq ft',
          imageUrl: '/shiv-prasad.jpg',
          type: '1, 2 BHK',
          description: 'Premium apartment building with modern amenities located in Airoli, Mumbai.',
          status: 'Available'
        },
        {
          title: 'Lodha Divino',
          location: 'Matunga East, Mumbai',
          price: '₹ 4.55 Cr',
          area: '1066 sq ft',
          imageUrl: '/lodha.png',
          type: '2 BHK',
          description: 'Luxury residences by Lodha, offering world-class amenities in Matunga East.',
          status: 'Available'
        },
        {
          title: 'Exclusive Penthouse',
          location: 'Dadar, Mumbai',
          price: '₹ 5.0 Cr',
          area: '2200 sq ft',
          imageUrl: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          type: 'Penthouse',
          description: 'Lavish and spacious penthouse in the heart of Dadar, Mumbai with panoramic city views.',
          status: 'Available'
        },
        {
          title: 'Modern 1BHK Studio',
          location: 'Sion, Mumbai',
          price: '₹ 1.2 Cr',
          area: '550 sq ft',
          imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          type: '1 BHK',
          description: 'Sleek modern studio apartment in Sion, ideal for young professionals or small families.',
          status: 'Available'
        }
      ];
      await Listing.insertMany(defaultListings);
      console.log('✅ Successfully seeded default property listings.');
    }
  } catch (error) {
    console.error('Error seeding properties:', error);
  }
};

const seedVideos = async () => {
  try {
    const count = await Video.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default walkthrough videos...');
      const defaultVideos = [
        {
          key: 'showcase',
          title: 'Left Walkthrough Video',
          url: '/showcase-video.mp4'
        },
        {
          key: 'walkthrough',
          title: 'Right Walkthrough Video',
          url: '/walkthrough.mp4'
        }
      ];
      await Video.insertMany(defaultVideos);
      console.log('✅ Successfully seeded default walkthrough videos.');
    }
  } catch (error) {
    console.error('Error seeding videos:', error);
  }
};

const seedAdmin = async () => {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding default admin user...');
      const adminUsername = process.env.ADMIN_USERNAME || 'anil ashan';
      const adminPassword = process.env.ADMIN_PASSWORD || '5050';
      
      await User.create({
        username: adminUsername,
        password: adminPassword, // Will be hashed automatically by the pre-save hook in User.js
      });
      console.log('✅ Default admin user seeded successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  }
};

// Connect DB & Start Server
const startServer = async () => {
  try {
    await connectDB();
    await seedAdmin();
    await seedListings();
    await seedVideos();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
