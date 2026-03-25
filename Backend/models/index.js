// Model exports
module.exports = {
  User: require('./User'),
  Staff: require('./Staff'),
  Patient: require('./Patient'),
  Appointment: require('./Appointment'),
  MedicalRecord: require('./MedicalRecord'),
  Ward: require('./Ward').Ward,
  Bed: require('./Ward').Bed
};
