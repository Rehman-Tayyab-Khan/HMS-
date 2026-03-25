const mongoose = require('mongoose');
const { Patient } = require('../models');
const { successResponse, errorResponse, invalidateCache, logger } = require('../utils');
const { retry } = require('../utils/retry');

// @desc    Get all patients (Optimized with pagination and caching)
// @route   GET /api/patients
// @access  Private
exports.getPatients = async (req, res) => {
  const startTime = Date.now();
  
  try {
    const { status, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const filter = {};
    
    // Build optimized filter
    if (status) filter.status = status;
    if (search) {
      // Use text index if available, otherwise regex (less efficient)
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { patientId: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Pagination
    const pageNum = parseInt(page);
    const limitNum = Math.min(parseInt(limit), 100); // Max 100 per page
    const skip = (pageNum - 1) * limitNum;

    // Optimized query with select and lean
    const [patients, total] = await Promise.all([
      Patient.find(filter)
        .select('-__v') // Exclude version key
        .sort(sort)
        .skip(skip)
        .limit(limitNum)
        .lean(), // Use lean for better performance
      Patient.countDocuments(filter)
    ]);

    const duration = Date.now() - startTime;
    logger.performance('getPatients', duration, { count: patients.length, total });

    return successResponse(res, {
      data: patients,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    }, 'Patients retrieved successfully');
  } catch (error) {
    logger.error('Error in getPatients', { error: error.message, stack: error.stack });
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Get single patient (Optimized)
// @route   GET /api/patients/:id
// @access  Private
exports.getPatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id)
      .select('-__v')
      .lean(); // Use lean for better performance
    
    if (!patient) {
      return errorResponse(res, 'Patient not found', 404);
    }
    
    return successResponse(res, patient, 'Patient retrieved successfully');
  } catch (error) {
    logger.error('Error in getPatient', { error: error.message, id: req.params.id });
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Create new patient (Optimized with retry)
// @route   POST /api/patients
// @access  Private
exports.createPatient = async (req, res) => {
  try {
    // Invalidate cache
    invalidateCache('patients');

    // Generate patient ID with atomic operation to prevent race conditions
    const generatePatientId = async () => {
      // Use findOneAndUpdate with upsert for atomic ID generation
      const counter = await mongoose.connection.db.collection('counters').findOneAndUpdate(
        { _id: 'patientCounter' },
        { $inc: { seq: 1 } },
        { upsert: true, returnDocument: 'after' }
      );
      const seq = counter.value ? counter.value.seq : 1;
      return `PAT${String(seq).padStart(6, '0')}`;
    };

    const patientId = await retry(generatePatientId, {
      maxRetries: 3,
      initialDelay: 100
    });

    // Create patient with retry on duplicate key error
    let patient;
    try {
      patient = await Patient.create({
        ...req.body,
        patientId
      });
    } catch (error) {
      // If duplicate patient ID, regenerate and retry once
      if (error.code === 11000 && error.keyPattern?.patientId) {
        logger.warn('Duplicate patient ID detected, regenerating', { patientId });
        const newPatientId = await generatePatientId();
        patient = await Patient.create({
          ...req.body,
          patientId: newPatientId
        });
      } else {
        throw error;
      }
    }

    logger.info('Patient created', { patientId: patient.patientId, id: patient._id });
    return successResponse(res, patient, 'Patient created successfully', 201);
  } catch (error) {
    logger.error('Error creating patient', { error: error.message, stack: error.stack });
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Update patient (Optimized with cache invalidation)
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    // Invalidate cache
    invalidateCache('patients');
    invalidateCache(`patients:${req.params.id}`);

    const patient = await Patient.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).select('-__v').lean();

    if (!patient) {
      return errorResponse(res, 'Patient not found', 404);
    }

    logger.info('Patient updated', { patientId: patient.patientId, id: req.params.id });
    return successResponse(res, patient, 'Patient updated successfully');
  } catch (error) {
    logger.error('Error updating patient', { error: error.message, id: req.params.id });
    return errorResponse(res, error.message, 500);
  }
};

// @desc    Delete patient (Optimized with cache invalidation)
// @route   DELETE /api/patients/:id
// @access  Private (Admin/Management)
exports.deletePatient = async (req, res) => {
  try {
    if (req.user.role !== 'admin' && req.user.role !== 'management') {
      logger.security('Unauthorized delete attempt', { 
        userId: req.user.id, 
        patientId: req.params.id 
      });
      return errorResponse(res, 'Not authorized', 403);
    }

    // Invalidate cache
    invalidateCache('patients');
    invalidateCache(`patients:${req.params.id}`);

    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) {
      return errorResponse(res, 'Patient not found', 404);
    }

    logger.info('Patient deleted', { patientId: patient.patientId, id: req.params.id });
    return successResponse(res, null, 'Patient deleted successfully');
  } catch (error) {
    logger.error('Error deleting patient', { error: error.message, id: req.params.id });
    return errorResponse(res, error.message, 500);
  }
};
