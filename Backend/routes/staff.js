const express = require('express');
const { protect, authorize, asyncHandler, authLimiter } = require('../middleware');
const { validateRequest } = require('../middleware/requestValidator');
const { staffValidation } = require('../validators');
const { staffController } = require('../controllers');

const router = express.Router();

// @route   GET /api/staff
// @desc    Get all staff members
// @access  Private
router.get('/', protect, asyncHandler(staffController.getStaff));

// @route   GET /api/staff/:id
// @desc    Get single staff member
// @access  Private
router.get('/:id', protect, asyncHandler(staffController.getStaffMember));

// @route   POST /api/staff
// @desc    Create new staff member
// @access  Public (for signup) / Private (Admin/Management)
router.post('/', [
  authLimiter,
  ...staffValidation,
  validateRequest
], asyncHandler(staffController.createStaff));

// @route   PUT /api/staff/:id
// @desc    Update staff member
// @access  Private (Admin/Management)
router.put('/:id', [
  protect,
  authorize('admin', 'management')
], asyncHandler(staffController.updateStaff));

// @route   DELETE /api/staff/:id
// @desc    Delete staff member
// @access  Private (Admin only)
router.delete('/:id', [
  protect,
  authorize('admin')
], asyncHandler(staffController.deleteStaff));

module.exports = router;
