import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';
import User, { IUser } from '../models/User';
import { generateToken } from '../middleware/auth';

/**
 * Login validation rules
 */
export const loginValidation = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

/**
 * Login controller
 * @route POST /auth/login
 * @access Public
 */
export const login = async (req: Request, res: Response) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username: username.toLowerCase() }) as IUser;

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    // Convert _id to string directly without relying on its methods
    const userId = String(user._id);
    const token = generateToken(userId);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * Logout controller
 * @route POST /auth/logout
 * @access Public
 * @note This is a client-side logout, the token is invalidated on the client
 */
export const logout = (_req: Request, res: Response) => {
  res.json({ message: 'Logout successful' });
};