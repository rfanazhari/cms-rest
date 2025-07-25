import express from 'express';
import { login, logout, loginValidation } from '../controllers/authController';

const router = express.Router();

/**
 * @route POST /auth/login
 * @desc Login user and get token
 * @access Public
 */
router.post('/login', loginValidation, login);

/**
 * @route POST /auth/logout
 * @desc Logout user (client-side)
 * @access Public
 */
router.post('/logout', logout);

export default router;