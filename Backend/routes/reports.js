const express = require('express');
const { protect, authorize, asyncHandler } = require('../middleware');
const { reportController } = require('../controllers');

const router = express.Router();

// @route   GET /api/reports/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin/Management)
router.get('/dashboard', [
  protect,
  authorize('admin', 'management')
], asyncHandler(reportController.getDashboard));

// @route   GET /api/reports/appointments
// @desc    Get appointment reports
// @access  Private (Admin/Management)
router.get('/appointments', [
  protect,
  authorize('admin', 'management')
], asyncHandler(reportController.getAppointmentReports));

// @route   GET /api/reports/patients
// @desc    Get patient reports
// @access  Private (Admin/Management)
router.get('/patients', [
  protect,
  authorize('admin', 'management')
], asyncHandler(reportController.getPatientReports));

// @route   GET /api/reports/wards
// @desc    Get ward occupancy reports
// @access  Private (Admin/Management)
router.get('/wards', [
  protect,
  authorize('admin', 'management')
], asyncHandler(reportController.getWardReports));

module.exports = router;
