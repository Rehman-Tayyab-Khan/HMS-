const mongoose = require('mongoose');
const { validationResult } = require('express-validator');
const { Staff } = require('../models');
const { successResponse, errorResponse, logger } = require('../utils');
const { retry } = require('../utils/retry');

// @desc    Get all staff members
// @route   GET /api/staff
// @access  Private
exports.getStaff = async (req, res) => {
  try {
    const { role, department, status } = req.query;
    const filter = {};
    
    if (role) filter.role = role;
    if (department) filter.department = department;
    if (status) filter.status = status;

    const staff = await Staff.find(filter).sort({ createdAt: -1 });
    return successResponse(res, staff, 'Staff retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get single staff member
// @route   GET /api/staff/:id
// @access  Private
exports.getStaffMember = async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id);
    if (!staff) {
      return errorResponse(res, 'Staff member not found', 404);
    }
    return successResponse(res, staff, 'Staff member retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Create new staff member
// @route   POST /api/staff
// @access  Public (for signup) / Private (Admin/Management)
exports.createStaff = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
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
        ...req.body,
        employeeId
      });
    } catch (error) {
      // If duplicate employee ID, regenerate and retry once
      if (error.code === 11000 && error.keyPattern?.employeeId) {
        logger.warn('Duplicate employee ID detected, regenerating', { employeeId });
        const newEmployeeId = await generateEmployeeId();
        staff = await Staff.create({
          ...req.body,
          employeeId: newEmployeeId
        });
      } else {
        throw error;
      }
    }

    logger.info('Staff member created', { employeeId: staff.employeeId, id: staff._id });
    return successResponse(res, staff, 'Staff member created successfully', 201);
  } catch (error) {
    logger.error('Error creating staff', { error: error.message, stack: error.stack });
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update staff member
// @route   PUT /api/staff/:id
// @access  Private (Admin/Management)
exports.updateStaff = async (req, res) => {
  try {
    const staff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!staff) {
      return errorResponse(res, 'Staff member not found', 404);
    }

    return successResponse(res, staff, 'Staff member updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Delete staff member
// @route   DELETE /api/staff/:id
// @access  Private (Admin)
exports.deleteStaff = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return errorResponse(res, 'Not authorized', 403);
    }

    const staff = await Staff.findByIdAndDelete(req.params.id);
    if (!staff) {
      return errorResponse(res, 'Staff member not found', 404);
    }
    
    return successResponse(res, null, 'Staff member deleted successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
