import jwt from 'jsonwebtoken';
import { config } from '../config.js';

export const authMiddleware = (req, res, next) => {
  try {
    // Get token from cookie
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
