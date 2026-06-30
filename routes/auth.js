import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }

  try {
    // Query MongoDB database for matching administrator account
    const user = await User.findOne({ username: username.trim().toLowerCase() });

    if (user) {
      // Authenticate hashed password
      const isMatch = await bcrypt.compare(password.trim(), user.password);

      if (isMatch) {
        const token = jwt.sign(
          { id: user._id, username: user.username },
          process.env.JWT_SECRET || 'secret',
          { expiresIn: '30d' }
        );
        return res.json({ token });
      }
    }

    res.status(401).json({ message: 'Invalid username or password' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
