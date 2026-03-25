const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { User, Staff } = require('../models');
const { successResponse, errorResponse, logger } = require('../utils');
const { clearUserCache } = require('../middleware/auth');
const { retry } = require('../utils/retry');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_super_secret_jwt_key', {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Format user response
const formatUserResponse = (user) => {
  return {
    id: user._id,
    email: user.email,
    role: user.role,
    staffId: user.staffId?._id || user.staffId,
    staffInfo: user.staffId && typeof user.staffId === 'object' ? {
      employeeId: user.staffId.employeeId,
      firstName: user.staffId.firstName,
      lastName: user.staffId.lastName,
      department: user.staffId.department,
      role: user.staffId.role
    } : null,
    profileCompleted: user.profileCompleted
  };
};

// @desc    Register a new user (Optimized)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { email, password } = req.body;

  // Check if user already exists (optimized query)
  const userExists = await User.findOne({ email }).select('_id').lean();
  if (userExists) {
    logger.security('Registration attempt with existing email', { email });
    return errorResponse(res, 'User already exists', 400);
  }

  // Create user without role/staff (profile incomplete)
  const user = await User.create({
    email,
    password,
    profileCompleted: false
  });

  const token = generateToken(user._id);

  logger.info('User registered', { userId: user._id, email: user.email });
  
  return successResponse(
    res,
    {
      token,
      user: formatUserResponse(user)
    },
    'User registered successfully',
    201
  );
};

// @desc    Login user (Optimized with security logging)
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists (optimized query)
  const user = await User.findOne({ email }).populate('staffId');
  if (!user || !user.isActive) {
    logger.security('Failed login attempt - user not found or inactive', { email, ip: req.ip });
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    logger.security('Failed login attempt - invalid password', { email, userId: user._id, ip: req.ip });
    return errorResponse(res, 'Invalid credentials', 401);
  }

  // Update last login (optimized - don't need full save)
  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() }, { new: false });
  
  // Clear user cache to force refresh
  clearUserCache(user._id);

  const token = generateToken(user._id);

  logger.info('User logged in', { userId: user._id, email: user.email, role: user.role });
  
  return successResponse(res, {
    token,
    user: formatUserResponse(user)
  }, 'Login successful');
};

// @desc    Get current user (Optimized - uses cached user from protect middleware)
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
  // User is already loaded in req.user by protect middleware
  return successResponse(res, {
    user: formatUserResponse(req.user)
  }, 'User retrieved successfully');
};

// @desc    Complete user profile (Optimized with retry)
// @route   POST /api/auth/complete-profile
// @access  Private
exports.completeProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    return errorResponse(res, 'User not found', 404);
  }

  if (user.profileCompleted) {
    return errorResponse(res, 'Profile already completed', 400);
  }

  const { firstName, lastName, phone, dateOfBirth, gender, address, role, department, specialization, licenseNumber } = req.body;

  // Generate employee ID with atomic operation to prevent race conditions
  const generateEmployeeId = async () => {
    // Use findOneAndUpdate with upsert for atomic ID generation
    const counter = await mongoose.connection.db.collection('counters').findOneAndUpdate(
      { _id: 'staffCounter' },
      { $inc: { seq: 1 } },
      { upsert: true, returnDocument: 'after' }
    );
    const seq = counter.value ? counter.value.seq : 1;
    return `EMP${String(seq).padStart(6, '0')}`;
  };

  const employeeId = await retry(generateEmployeeId, {
    maxRetries: 3,
    initialDelay: 100
  });

  // Create staff member with retry on duplicate key error
  let staff;
  try {
    staff = await Staff.create({
      employeeId,
      firstName,
      lastName,
      email: user.email,
      phone,
      dateOfBirth,
      gender,
      address: address || {},
      role,
      department,
      specialization: specialization || undefined,
      licenseNumber: licenseNumber || undefined
    });
  } catch (error) {
    // If duplicate employee ID, regenerate and retry once
    if (error.code === 11000 && error.keyPattern?.employeeId) {
      logger.warn('Duplicate employee ID detected, regenerating', { employeeId });
      const newEmployeeId = await generateEmployeeId();
      staff = await Staff.create({
        employeeId: newEmployeeId,
        firstName,
        lastName,
        email: user.email,
        phone,
        dateOfBirth,
        gender,
        address: address || {},
        role,
        department,
        specialization: specialization || undefined,
        licenseNumber: licenseNumber || undefined
      });
    } else {
      throw error;
    }
  }

  // Update user with staff and role (optimized)
  await User.findByIdAndUpdate(user._id, {
    staffId: staff._id,
    role,
    profileCompleted: true
  });

  // Clear cache
  clearUserCache(user._id);

  const updatedUser = await User.findById(user._id).populate('staffId').lean();

  logger.info('Profile completed', { userId: user._id, staffId: staff._id, role });

  return successResponse(res, {
    token: generateToken(user._id),
    user: formatUserResponse(updatedUser)
  }, 'Profile completed successfully');
};

// @desc    Change user password (Optimized with security logging)
// @route   POST /api/auth/change-password
// @access  Private
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id);

  // Verify current password
  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    logger.security('Password change failed - incorrect current password', {
      userId: user._id,
      ip: req.ip
    });
    return errorResponse(res, 'Current password is incorrect', 401);
  }

  // Update password (triggers pre-save hook for hashing)
  user.password = newPassword;
  await user.save();

  // Clear cache
  clearUserCache(user._id);

  logger.info('Password changed', { userId: user._id });

  return successResponse(res, null, 'Password changed successfully');
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
  // In future, you can implement token blacklisting here
  return successResponse(res, null, 'Logged out successfully');
};

// @desc    Update user profile (Optimized)
// @route   PUT /api/auth/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  
  // Only allow email update for now
  if (req.body.email && req.body.email !== user.email) {
    // Check if email already exists (optimized query)
    const emailExists = await User.findOne({ email: req.body.email }).select('_id').lean();
    if (emailExists) {
      return errorResponse(res, 'Email already in use', 400);
    }
    
    await User.findByIdAndUpdate(user._id, { email: req.body.email });
    
    // Clear cache
    clearUserCache(user._id);
    
    logger.info('Profile updated', { userId: user._id, field: 'email' });
  }

  const updatedUser = await User.findById(user._id).populate('staffId').lean();

  return successResponse(res, {
    user: formatUserResponse(updatedUser)
  }, 'Profile updated successfully');
};
