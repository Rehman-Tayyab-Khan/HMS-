const express = require('express');
const { protect, asyncHandler } = require('../middleware');
const { validateRequest } = require('../middleware/requestValidator');
const { appointmentValidation } = require('../validators');
const { appointmentController } = require('../controllers');

const router = express.Router();

// @route   GET /api/appointments
// @desc    Get all appointments
// @access  Private
router.get('/', protect, asyncHandler(appointmentController.getAppointments));

// @route   GET /api/appointments/:id
// @desc    Get single appointment
// @access  Private
router.get('/:id', protect, asyncHandler(appointmentController.getAppointment));

// @route   POST /api/appointments
// @desc    Create new appointment
// @access  Private
router.post('/', [
  protect,
  ...appointmentValidation,
  validateRequest
], asyncHandler(appointmentController.createAppointment));

// @route   PUT /api/appointments/:id
// @desc    Update appointment
// @access  Private
router.put('/:id', protect, asyncHandler(appointmentController.updateAppointment));

// @route   DELETE /api/appointments/:id
// @desc    Cancel appointment
// @access  Private
router.delete('/:id', protect, asyncHandler(appointmentController.cancelAppointment));

module.exports = router;
