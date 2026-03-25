const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  employeeId: {
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
    required: true,
    unique: true,
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
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'nurse', 'management'],
    required: true
  },
  department: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    required: function() {
      return this.role === 'doctor';
    }
  },
  licenseNumber: {
    type: String,
    required: function() {
      return this.role === 'doctor' || this.role === 'nurse';
    }
  },
  hireDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  salary: {
    type: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'on-leave', 'terminated'],
    default: 'active'
  },
  emergencyContact: {
    name: String,
    relationship: String,
    phone: String
  }
}, {
  timestamps: true
});

// Indexes for performance (employeeId and email already have unique: true in schema)
staffSchema.index({ role: 1 });
staffSchema.index({ department: 1 });
staffSchema.index({ status: 1 });
staffSchema.index({ firstName: 1, lastName: 1 }); // Compound index for name search
// Text index for full-text search
staffSchema.index({ 
  firstName: 'text', 
  lastName: 'text', 
  employeeId: 'text',
  email: 'text',
  department: 'text'
}, {
  weights: {
    employeeId: 10,
    email: 5,
    department: 3,
    firstName: 2,
    lastName: 2
  },
  name: 'staff_text_search'
});
// Compound indexes for common queries
staffSchema.index({ role: 1, status: 1 });
staffSchema.index({ department: 1, status: 1 });
staffSchema.index({ role: 1, department: 1 });
staffSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model('Staff', staffSchema);
