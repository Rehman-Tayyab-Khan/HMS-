const { Appointment, MedicalRecord, Patient, Staff, Ward, Bed } = require('../models');
const { successResponse, errorResponse } = require('../utils');

// @desc    Get dashboard statistics
// @route   GET /api/reports/dashboard
// @access  Private (Admin/Management)
exports.getDashboard = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Total counts
    const totalPatients = await Patient.countDocuments({ status: 'active' });
    const totalStaff = await Staff.countDocuments({ status: 'active' });
    const totalWards = await Ward.countDocuments({ status: 'active' });
    const totalBeds = await Bed.countDocuments();
    const occupiedBeds = await Bed.countDocuments({ status: 'occupied' });
    const availableBeds = totalBeds - occupiedBeds;

    // Today's appointments
    const todayAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: today, $lt: tomorrow }
    });

    // Pending appointments
    const pendingAppointments = await Appointment.countDocuments({
      status: { $in: ['scheduled', 'confirmed'] }
    });

    // Recent medical records (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recentRecords = await MedicalRecord.countDocuments({
      visitDate: { $gte: weekAgo }
    });

    // Staff by role
    const staffByRole = await Staff.aggregate([
      { $group: { _id: '$role', count: { $sum: 1 } } }
    ]);

    // Appointments by status
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    return successResponse(res, {
      overview: {
        totalPatients,
        totalStaff,
        totalWards,
        totalBeds,
        occupiedBeds,
        availableBeds
      },
      appointments: {
        today: todayAppointments,
        pending: pendingAppointments
      },
      medicalRecords: {
        recent: recentRecords
      },
      staffByRole,
      appointmentsByStatus
    }, 'Dashboard statistics retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get appointment reports
// @route   GET /api/reports/appointments
// @access  Private (Admin/Management)
exports.getAppointmentReports = async (req, res) => {
  try {
    const { startDate, endDate, doctor, status } = req.query;
    const filter = {};

    if (startDate && endDate) {
      filter.appointmentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (doctor) filter.doctor = doctor;
    if (status) filter.status = status;

    const appointments = await Appointment.find(filter)
      .populate('patient', 'firstName lastName patientId')
      .populate('doctor', 'firstName lastName employeeId specialization')
      .sort({ appointmentDate: -1 });

    return successResponse(res, appointments, 'Appointment reports retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get patient reports
// @route   GET /api/reports/patients
// @access  Private (Admin/Management)
exports.getPatientReports = async (req, res) => {
  try {
    const patients = await Patient.find()
      .sort({ createdAt: -1 })
      .limit(100);

    return successResponse(res, patients, 'Patient reports retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get ward occupancy reports
// @route   GET /api/reports/wards
// @access  Private (Admin/Management)
exports.getWardReports = async (req, res) => {
  try {
    const wards = await Ward.find()
      .populate('headNurse', 'firstName lastName');

    const wardReports = await Promise.all(wards.map(async (ward) => {
      const beds = await Bed.find({ ward: ward._id });
      const occupied = beds.filter(b => b.status === 'occupied').length;
      const available = beds.filter(b => b.status === 'available').length;
      const occupancyRate = beds.length > 0 ? (occupied / beds.length) * 100 : 0;

      return {
        ward: {
          wardNumber: ward.wardNumber,
          wardName: ward.wardName,
          wardType: ward.wardType,
          headNurse: ward.headNurse
        },
        beds: {
          total: beds.length,
          occupied,
          available,
          occupancyRate: occupancyRate.toFixed(2)
        }
      };
    }));

    return successResponse(res, wardReports, 'Ward reports retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
