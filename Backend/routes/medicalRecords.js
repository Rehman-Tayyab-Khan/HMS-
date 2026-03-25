const express = require('express');
const { protect, authorize, asyncHandler } = require('../middleware');
const { validateRequest } = require('../middleware/requestValidator');
const { medicalRecordValidation } = require('../validators');
const { medicalRecordController } = require('../controllers');

const router = express.Router();

// @route   GET /api/medical-records
// @desc    Get all medical records
// @access  Private
router.get('/', protect, asyncHandler(medicalRecordController.getMedicalRecords));

// @route   GET /api/medical-records/:id
// @desc    Get single medical record
// @access  Private
router.get('/:id', protect, asyncHandler(medicalRecordController.getMedicalRecord));

// @route   POST /api/medical-records
// @desc    Create new medical record
// @access  Private (Doctor only)
router.post('/', [
  protect,
  authorize('doctor'),
  ...medicalRecordValidation,
  validateRequest
], asyncHandler(medicalRecordController.createMedicalRecord));

// @route   PUT /api/medical-records/:id
// @desc    Update medical record
// @access  Private (Doctor only)
router.put('/:id', [
  protect,
  authorize('doctor')
], asyncHandler(medicalRecordController.updateMedicalRecord));

module.exports = router;
