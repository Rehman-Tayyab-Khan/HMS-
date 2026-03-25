const express = require('express');
const { protect, authLimiter, asyncHandler } = require('../middleware');
const { validateRequest } = require('../middleware/requestValidator');
const { registerValidation, loginValidation, completeProfileValidation, changePasswordValidation } = require('../validators');
const { authController } = require('../controllers');

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user (Simple signup - just email/password)
// @access  Public
router.post('/register', [
  authLimiter,
  ...registerValidation,
  validateRequest
], asyncHandler(authController.register));

// @route   POST /api/auth/login
// @desc    Login user (Rate Limited, Validated)
// @access  Public
router.post('/login', [
  authLimiter,
  ...loginValidation,
  validateRequest
], asyncHandler(authController.login));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, asyncHandler(authController.getMe));

// @route   POST /api/auth/complete-profile
// @desc    Complete user profile (create staff and link to user)
// @access  Private
router.post('/complete-profile', [
  protect,
  ...completeProfileValidation,
  validateRequest
], asyncHandler(authController.completeProfile));

// @route   POST /api/auth/change-password
// @desc    Change user password (Validated, Rate Limited)
// @access  Private
router.post('/change-password', [
  protect,
  authLimiter,
  ...changePasswordValidation,
  validateRequest
], asyncHandler(authController.changePassword));

// @route   POST /api/auth/logout
// @desc    Logout user (optional - for token blacklisting in future)
// @access  Private
router.post('/logout', protect, asyncHandler(authController.logout));

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
const { body } = require('express-validator');
router.put('/profile', [
  protect,
  body('email').optional().isEmail().normalizeEmail().trim()
], asyncHandler(authController.updateProfile));

module.exports = router;
