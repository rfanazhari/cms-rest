import express from 'express';
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  userValidation,
} from '../controllers/userController';
import { auth, isOwner } from '../middleware/auth';

const router = express.Router();

// GET /user - Get all users (Public)
router.get('/', getUsers);

// GET /user/:id - Get user by ID (Public)
router.get('/:id', getUserById);

// POST /user - Create a new user (Private - authenticated)
router.post('/', auth, userValidation, createUser);

// PATCH /user/:id - Update user (Private - owner only)
router.patch(
  '/:id',
  auth,
  isOwner(async (req) => req.params.id),
  updateUser
);

// DELETE /user/:id - Delete user (Private - owner only)
router.delete(
  '/:id',
  auth,
  isOwner(async (req) => req.params.id),
  deleteUser
);

export default router;