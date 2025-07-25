import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

// JWT Secret from environment variables
const JWT_SECRET: string = process.env.JWT_SECRET || 'your_jwt_secret_key_here';

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request object
 */
export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log(`Token ${token}`);
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string };

    console.log(decoded);
    
    // Find user by id
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    // Attach user and token to request
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

/**
 * Owner middleware
 * Ensures the authenticated user is the owner of the resource
 * @param getResourceUserId Function to extract user ID from the resource
 */
export const isOwner = (getResourceUserId: (req: Request) => Promise<string>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      
      const resourceUserId = await getResourceUserId(req);
      
      if (req.user._id.toString() !== resourceUserId) {
        return res.status(403).json({ message: 'Access denied' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
  };
};

/**
 * Generate JWT token for a user
 * @param userId User ID to include in the token
 * @returns JWT token
 */
export const generateToken = (userId: string): string => {
  // Get expiresIn from environment or use default
  const expiresIn = process.env.JWT_EXPIRES_IN || '1d';
  
  // Create the payload
  const payload = { id: userId };
  
  // Use type assertion to bypass TypeScript's type checking
  return jwt.sign(payload, JWT_SECRET as any, { expiresIn } as any);
};