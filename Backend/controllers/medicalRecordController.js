const { validationResult } = require('express-validator');
const { MedicalRecord } = require('../models');
const { successResponse, errorResponse } = require('../utils');

// @desc    Get all medical records
// @route   GET /api/medical-records
// @access  Private
exports.getMedicalRecords = async (req, res) => {
  try {
    const { patient, doctor, date } = req.query;
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'doctor') {
      filter.doctor = req.user.staffId._id;
    }

    if (patient) filter.patient = patient;
    if (doctor) filter.doctor = doctor;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.visitDate = { $gte: startDate, $lte: endDate };
    }

    const records = await MedicalRecord.find(filter)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName employeeId specialization')
      .populate('appointment')
      .sort({ visitDate: -1 });

    return successResponse(res, records, 'Medical records retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get single medical record
// @route   GET /api/medical-records/:id
// @access  Private
exports.getMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('appointment');

    if (!record) {
      return errorResponse(res, 'Medical record not found', 404);
    }

    return successResponse(res, record, 'Medical record retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Create new medical record
// @route   POST /api/medical-records
// @access  Private (Doctor only)
exports.createMedicalRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    // Generate record ID
    const count = await MedicalRecord.countDocuments();
    const recordId = `MR${String(count + 1).padStart(6, '0')}`;

    const record = await MedicalRecord.create({
      ...req.body,
      recordId,
      doctor: req.user.staffId._id
    });

    const populatedRecord = await MedicalRecord.findById(record._id)
      .populate('patient')
      .populate('doctor');

    return successResponse(res, populatedRecord, 'Medical record created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update medical record
// @route   PUT /api/medical-records/:id
// @access  Private (Doctor only)
exports.updateMedicalRecord = async (req, res) => {
  try {
    const record = await MedicalRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient')
      .populate('doctor');

    if (!record) {
      return errorResponse(res, 'Medical record not found', 404);
    }

    return successResponse(res, record, 'Medical record updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
