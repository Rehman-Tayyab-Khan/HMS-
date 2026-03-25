const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  wardNumber: {
    type: String,
    required: true,
    unique: true
  },
  wardName: {
    type: String,
    required: true
  },
  wardType: {
    type: String,
    enum: ['general', 'icu', 'emergency', 'maternity', 'pediatric', 'surgical', 'cardiac'],
    required: true
  },
  totalBeds: {
    type: Number,
    required: true,
    min: 1
  },
  availableBeds: {
    type: Number,
    required: true,
    default: function() {
      return this.totalBeds;
    }
  },
  floor: {
    type: Number,
    required: true
  },
  description: {
    type: String
  },
  chargePerDay: {
    type: Number,
    required: true
  },
  headNurse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Staff'
  },
  status: {
    type: String,
    enum: ['active', 'maintenance', 'closed'],
    default: 'active'
  }
}, {
  timestamps: true
});

const bedSchema = new mongoose.Schema({
  bedNumber: {
    type: String,
    required: true
  },
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient'
  },
  status: {
    type: String,
    enum: ['available', 'occupied', 'maintenance', 'reserved'],
    default: 'available'
  },
  admissionDate: {
    type: Date
  },
  dischargeDate: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance (wardNumber already has unique: true in schema)
wardSchema.index({ wardType: 1 });
wardSchema.index({ status: 1 });

bedSchema.index({ bedNumber: 1, ward: 1 });
bedSchema.index({ ward: 1 });
bedSchema.index({ patient: 1 });
bedSchema.index({ status: 1 });

const Ward = mongoose.model('Ward', wardSchema);
const Bed = mongoose.model('Bed', bedSchema);

module.exports = { Ward, Bed };
