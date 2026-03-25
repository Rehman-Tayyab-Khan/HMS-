const express = require('express');
const { body } = require('express-validator');
const { protect, authorize, asyncHandler } = require('../middleware');
const { validateRequest } = require('../middleware/requestValidator');
const { wardValidation, bedAssignmentValidation } = require('../validators');
const { wardController } = require('../controllers');

const router = express.Router();

// @route   GET /api/wards
// @desc    Get all wards
// @access  Private
router.get('/', protect, asyncHandler(wardController.getWards));

// @route   GET /api/wards/:id
// @desc    Get single ward
// @access  Private
router.get('/:id', protect, asyncHandler(wardController.getWard));

// @route   POST /api/wards
// @desc    Create new ward
// @access  Private (Admin/Management)
router.post('/', [
  protect,
  authorize('admin', 'management'),
  ...wardValidation,
  validateRequest
], asyncHandler(wardController.createWard));

// @route   PUT /api/wards/:id
// @desc    Update ward
// @access  Private (Admin/Management)
router.put('/:id', [
  protect,
  authorize('admin', 'management')
], asyncHandler(wardController.updateWard));

// @route   GET /api/wards/:id/beds
// @desc    Get beds for a ward
// @access  Private
router.get('/:id/beds', protect, asyncHandler(wardController.getWardBeds));

// @route   POST /api/wards/:id/beds
// @desc    Assign patient to bed
// @access  Private
router.post('/:id/beds', [
  protect,
  ...bedAssignmentValidation,
  validateRequest
], asyncHandler(wardController.assignBed));

// @route   PUT /api/wards/beds/:bedId/discharge
// @desc    Discharge patient from bed
// @access  Private
router.put('/beds/:bedId/discharge', protect, asyncHandler(wardController.dischargeBed));

module.exports = router;
