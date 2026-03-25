const express = require('express');
const { protect, asyncHandler, validateObjectId } = require('../middleware');
const { validateRequest } = require('../middleware/requestValidator');
const { patientValidation } = require('../validators');
const { patientController } = require('../controllers');

const router = express.Router();

// @route   GET /api/patients
// @desc    Get all patients (Cached, Paginated, Optimized)
// @access  Private
router.get('/', protect, asyncHandler(patientController.getPatients));

// @route   GET /api/patients/:id
// @desc    Get single patient (Cached, Optimized)
// @access  Private
router.get('/:id', protect, validateObjectId, asyncHandler(patientController.getPatient));

// @route   POST /api/patients
// @desc    Create new patient (Validated, Cache Invalidated)
// @access  Private
router.post('/', [
  protect,
  ...patientValidation,
  validateRequest
], asyncHandler(patientController.createPatient));

// @route   PUT /api/patients/:id
// @desc    Update patient (Validated, Cache Invalidated)
// @access  Private
router.put('/:id', [
  protect,
  validateObjectId,
  ...patientValidation,
  validateRequest
], asyncHandler(patientController.updatePatient));

// @route   DELETE /api/patients/:id
// @desc    Delete patient (Cache Invalidated)
// @access  Private (Admin/Management)
router.delete('/:id', protect, validateObjectId, asyncHandler(patientController.deletePatient));

module.exports = router;
