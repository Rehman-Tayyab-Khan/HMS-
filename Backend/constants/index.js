// Application constants

module.exports = {
  ROLES: {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    MANAGEMENT: 'management'
  },

  PATIENT_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    DECEASED: 'deceased'
  },

  STAFF_STATUS: {
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    ON_LEAVE: 'on-leave',
    TERMINATED: 'terminated'
  },

  APPOINTMENT_STATUS: {
    SCHEDULED: 'scheduled',
    CONFIRMED: 'confirmed',
    IN_PROGRESS: 'in-progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
    NO_SHOW: 'no-show'
  },

  APPOINTMENT_TYPE: {
    CONSULTATION: 'consultation',
    FOLLOW_UP: 'follow-up',
    EMERGENCY: 'emergency',
    SURGERY: 'surgery',
    CHECKUP: 'checkup'
  },

  WARD_TYPE: {
    GENERAL: 'general',
    ICU: 'icu',
    EMERGENCY: 'emergency',
    MATERNITY: 'maternity',
    PEDIATRIC: 'pediatric',
    SURGICAL: 'surgical',
    CARDIAC: 'cardiac'
  },

  WARD_STATUS: {
    ACTIVE: 'active',
    MAINTENANCE: 'maintenance',
    CLOSED: 'closed'
  },

  BED_STATUS: {
    AVAILABLE: 'available',
    OCCUPIED: 'occupied',
    MAINTENANCE: 'maintenance',
    RESERVED: 'reserved'
  },

  GENDER: {
    MALE: 'male',
    FEMALE: 'female',
    OTHER: 'other'
  },

  BLOOD_GROUP: {
    A_POSITIVE: 'A+',
    A_NEGATIVE: 'A-',
    B_POSITIVE: 'B+',
    B_NEGATIVE: 'B-',
    AB_POSITIVE: 'AB+',
    AB_NEGATIVE: 'AB-',
    O_POSITIVE: 'O+',
    O_NEGATIVE: 'O-'
  }
};
