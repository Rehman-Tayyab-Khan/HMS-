const { validationResult } = require('express-validator');
const { Ward, Bed } = require('../models');
const { successResponse, errorResponse } = require('../utils');

// @desc    Get all wards
// @route   GET /api/wards
// @access  Private
exports.getWards = async (req, res) => {
  try {
    const { status, wardType } = req.query;
    const filter = {};
    
    if (status) filter.status = status;
    if (wardType) filter.wardType = wardType;

    const wards = await Ward.find(filter)
      .populate('headNurse', 'firstName lastName employeeId')
      .sort({ wardNumber: 1 });

    return successResponse(res, wards, 'Wards retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get single ward
// @route   GET /api/wards/:id
// @access  Private
exports.getWard = async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id)
      .populate('headNurse');
    
    if (!ward) {
      return errorResponse(res, 'Ward not found', 404);
    }

    // Get beds for this ward
    const beds = await Bed.find({ ward: ward._id })
      .populate('patient', 'firstName lastName patientId');

    return successResponse(res, { ward, beds }, 'Ward retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Create new ward
// @route   POST /api/wards
// @access  Private (Admin/Management)
exports.createWard = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    // Generate ward number
    const count = await Ward.countDocuments();
    const wardNumber = `WARD${String(count + 1).padStart(3, '0')}`;

    const ward = await Ward.create({
      ...req.body,
      wardNumber,
      availableBeds: req.body.totalBeds
    });

    // Create beds for the ward
    const beds = [];
    for (let i = 1; i <= req.body.totalBeds; i++) {
      const bed = await Bed.create({
        bedNumber: `${wardNumber}-BED${String(i).padStart(3, '0')}`,
        ward: ward._id,
        status: 'available'
      });
      beds.push(bed);
    }

    return successResponse(res, { ward, beds }, 'Ward created successfully', 201);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update ward
// @route   PUT /api/wards/:id
// @access  Private (Admin/Management)
exports.updateWard = async (req, res) => {
  try {
    const ward = await Ward.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('headNurse');

    if (!ward) {
      return errorResponse(res, 'Ward not found', 404);
    }

    return successResponse(res, ward, 'Ward updated successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get beds for a ward
// @route   GET /api/wards/:id/beds
// @access  Private
exports.getWardBeds = async (req, res) => {
  try {
    const beds = await Bed.find({ ward: req.params.id })
      .populate('patient', 'firstName lastName patientId')
      .populate('ward', 'wardName wardNumber');

    return successResponse(res, beds, 'Beds retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Assign patient to bed
// @route   POST /api/wards/:id/beds
// @access  Private
exports.assignBed = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return errorResponse(res, 'Validation failed', 400, errors.array());
  }

  try {
    const { bedId, patientId } = req.body;

    const bed = await Bed.findById(bedId);
    if (!bed) {
      return errorResponse(res, 'Bed not found', 404);
    }

    if (bed.status !== 'available') {
      return errorResponse(res, 'Bed is not available', 400);
    }

    bed.patient = patientId;
    bed.status = 'occupied';
    bed.admissionDate = new Date();
    await bed.save();

    // Update ward available beds count
    const ward = await Ward.findById(bed.ward);
    ward.availableBeds -= 1;
    await ward.save();

    const populatedBed = await Bed.findById(bed._id)
      .populate('patient')
      .populate('ward');

    return successResponse(res, populatedBed, 'Patient assigned to bed successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Discharge patient from bed
// @route   PUT /api/wards/beds/:bedId/discharge
// @access  Private
exports.dischargeBed = async (req, res) => {
  try {
    const bed = await Bed.findById(req.params.bedId);
    if (!bed) {
      return errorResponse(res, 'Bed not found', 404);
    }

    bed.patient = null;
    bed.status = 'available';
    bed.dischargeDate = new Date();
    await bed.save();

    // Update ward available beds count
    const ward = await Ward.findById(bed.ward);
    ward.availableBeds += 1;
    await ward.save();

    return successResponse(res, bed, 'Patient discharged successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
