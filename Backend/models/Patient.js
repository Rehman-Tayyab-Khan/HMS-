const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  patientId: {
    type: String,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  allergies: [{
    type: String
  }],
  medicalHistory: [{
    condition: String,
    diagnosisDate: Date,
    notes: String
  }],
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    relationship: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    }
  },
  insurance: {
    provider: String,
    policyNumber: String,
    expiryDate: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Indexes for performance (patientId already has unique: true in schema)
patientSchema.index({ email: 1 }, { sparse: true }); // Sparse index for optional email
patientSchema.index({ status: 1 });
patientSchema.index({ firstName: 1, lastName: 1 }); // Compound index for name search
patientSchema.index({ dateOfBirth: 1 });
patientSchema.index({ createdAt: -1 });
// Text index for full-text search (optimized)
patientSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  patientId: 'text',
  email: 'text'
}, {
  weights: {
    patientId: 10,
    email: 5,
    firstName: 3,
    lastName: 3
  },
  name: 'patient_text_search'
});
// Compound indexes for common queries
patientSchema.index({ status: 1, createdAt: -1 });
patientSchema.index({ status: 1, dateOfBirth: 1 });

module.exports = mongoose.model('Patient', patientSchema);
