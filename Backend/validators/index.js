// Validation schemas and helpers
const { body } = require('express-validator');
const { ROLES, GENDER, WARD_TYPE } = require('../constants');

// Common validation rules
const emailValidation = body('email')
  .isEmail()
  .normalizeEmail()
  .trim()
  .withMessage('Please provide a valid email');

const passwordValidation = body('password')
  .isLength({ min: 6 })
  .withMessage('Password must be at least 6 characters');

const nameValidation = (fieldName = 'name') => 
  body(fieldName)
    .notEmpty()
    .trim()
    .escape()
    .withMessage(`${fieldName} is required`);

const phoneValidation = body('phone')
  .notEmpty()
  .trim()
  .withMessage('Phone number is required');

const dateOfBirthValidation = body('dateOfBirth')
  .isISO8601()
  .withMessage('Please provide a valid date of birth');

const genderValidation = body('gender')
  .isIn(Object.values(GENDER))
  .withMessage('Invalid gender');

const roleValidation = body('role')
  .isIn(Object.values(ROLES))
  .withMessage('Invalid role');

// Auth validations
exports.registerValidation = [
  emailValidation,
  passwordValidation
];

exports.loginValidation = [
  emailValidation,
  body('password').notEmpty().withMessage('Password is required')
];

exports.completeProfileValidation = [
  nameValidation('firstName'),
  nameValidation('lastName'),
  phoneValidation,
  dateOfBirthValidation,
  genderValidation,
  roleValidation,
  body('department').notEmpty().trim().escape()
];

exports.changePasswordValidation = [
  body('currentPassword').notEmpty(),
  passwordValidation
];

// Patient validations
exports.patientValidation = [
  nameValidation('firstName'),
  nameValidation('lastName'),
  phoneValidation,
  dateOfBirthValidation,
  genderValidation
];

// Staff validations
exports.staffValidation = [
  nameValidation('firstName'),
  nameValidation('lastName'),
  emailValidation,
  phoneValidation,
  roleValidation,
  body('department').notEmpty()
];

// Appointment validations
exports.appointmentValidation = [
  body('patient').notEmpty().withMessage('Patient is required'),
  body('doctor').notEmpty().withMessage('Doctor is required'),
  body('appointmentDate').isISO8601().withMessage('Valid appointment date is required'),
  body('appointmentTime').notEmpty().withMessage('Appointment time is required'),
  body('reason').notEmpty().withMessage('Reason is required')
];

// Medical Record validations
exports.medicalRecordValidation = [
  body('patient').notEmpty().withMessage('Patient is required'),
  body('chiefComplaint').notEmpty().withMessage('Chief complaint is required'),
  body('diagnosis').notEmpty().withMessage('Diagnosis is required')
];

// Ward validations
exports.wardValidation = [
  body('wardName').notEmpty().withMessage('Ward name is required'),
  body('wardType').isIn(Object.values(WARD_TYPE)).withMessage('Invalid ward type'),
  body('totalBeds').isInt({ min: 1 }).withMessage('Total beds must be at least 1'),
  body('floor').isInt({ min: 1 }).withMessage('Floor must be at least 1'),
  body('chargePerDay').isFloat({ min: 0 }).withMessage('Charge per day must be 0 or greater')
];

// Bed validations
exports.bedAssignmentValidation = [
  body('bedId').notEmpty().withMessage('Bed ID is required'),
  body('patientId').notEmpty().withMessage('Patient ID is required')
];
