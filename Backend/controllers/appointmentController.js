const { validationResult } = require('express-validator');
const { Appointment } = require('../models');
const { successResponse, errorResponse } = require('../utils');

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    const { status, doctor, patient, date } = req.query;
    const filter = {};

    // Role-based filtering
    if (req.user.role === 'doctor') {
      filter.doctor = req.user.staffId._id;
    }

    if (status) filter.status = status;
    if (doctor) filter.doctor = doctor;
    if (patient) filter.patient = patient;
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);
      filter.appointmentDate = { $gte: startDate, $lte: endDate };
    }

    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName patientId phone')
      .populate('doctor', 'firstName lastName employeeId specialization')
      .populate('createdBy', 'firstName lastName')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    return successResponse(res, appointments, 'Appointments retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient')
      .populate('doctor')
      .populate('createdBy');

    if (!appointment) {
      return errorResponse(res, 'Appointment not found', 404);
    }

    return successResponse(res, appointment, 'Appointment retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    // Generate appointment ID
    const count = await Appointment.countDocuments();
    const appointmentId = `APT${String(count + 1).padStart(6, '0')}`;

    const appointment = await Appointment.create({
      ...req.body,
      appointmentId,
      createdBy: req.user.staffId._id
    });

    const populatedAppointment = await Appointment.findById(appointment._id)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName employeeId');

    return successResponse(res, populatedAppointment, 'Appointment created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('patient')
      .populate('doctor');

    if (!appointment) {
      return errorResponse(res, 'Appointment not found', 404);
    }

    return successResponse(res, appointment, 'Appointment updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return errorResponse(res, 'Appointment not found', 404);
    }

    // Update status to cancelled instead of deleting
    appointment.status = 'cancelled';
    await appointment.save();

    return successResponse(res, appointment, 'Appointment cancelled successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
