# Controller Structure Documentation

## 📁 Architecture Overview

The backend now follows the **MVC (Model-View-Controller)** pattern with clear separation of concerns:

```
Backend/
├── controllers/          # Business logic
│   ├── authController.js
│   ├── patientController.js
│   ├── staffController.js
│   ├── appointmentController.js
│   ├── medicalRecordController.js
│   ├── wardController.js
│   └── reportController.js
├── routes/               # Route definitions (thin layer)
│   ├── auth.js
│   ├── patients.js
│   ├── staff.js
│   ├── appointments.js
│   ├── medicalRecords.js
│   ├── wards.js
│   └── reports.js
├── models/               # Database models
├── middleware/           # Middleware functions
└── utils/                # Utility functions
```

## 🎯 Benefits

1. **Separation of Concerns**: Routes handle routing, controllers handle business logic
2. **Reusability**: Controller functions can be reused across different routes
3. **Testability**: Controllers can be unit tested independently
4. **Maintainability**: Easier to find and modify business logic
5. **Consistency**: All responses use standardized response formatter

## 📝 Controller Structure

### Auth Controller (`authController.js`)
- `register()` - User registration
- `login()` - User authentication
- `getMe()` - Get current user
- `completeProfile()` - Complete user profile
- `changePassword()` - Change password
- `logout()` - Logout user
- `updateProfile()` - Update user profile

### Patient Controller (`patientController.js`)
- `getPatients()` - Get all patients
- `getPatient()` - Get single patient
- `createPatient()` - Create new patient
- `updatePatient()` - Update patient
- `deletePatient()` - Delete patient

### Staff Controller (`staffController.js`)
- `getStaff()` - Get all staff
- `getStaffMember()` - Get single staff member
- `createStaff()` - Create new staff
- `updateStaff()` - Update staff
- `deleteStaff()` - Delete staff

### Appointment Controller (`appointmentController.js`)
- `getAppointments()` - Get all appointments
- `getAppointment()` - Get single appointment
- `createAppointment()` - Create new appointment
- `updateAppointment()` - Update appointment
- `cancelAppointment()` - Cancel appointment

### Medical Record Controller (`medicalRecordController.js`)
- `getMedicalRecords()` - Get all medical records
- `getMedicalRecord()` - Get single medical record
- `createMedicalRecord()` - Create new medical record
- `updateMedicalRecord()` - Update medical record

### Ward Controller (`wardController.js`)
- `getWards()` - Get all wards
- `getWard()` - Get single ward
- `createWard()` - Create new ward
- `updateWard()` - Update ward
- `getWardBeds()` - Get beds for a ward
- `assignBed()` - Assign patient to bed
- `dischargeBed()` - Discharge patient from bed

### Report Controller (`reportController.js`)
- `getDashboard()` - Get dashboard statistics
- `getAppointmentReports()` - Get appointment reports
- `getPatientReports()` - Get patient reports
- `getWardReports()` - Get ward occupancy reports

## 🔄 Route to Controller Mapping

### Example: Auth Routes

**Before (Business logic in routes):**
```javascript
router.post('/register', [...], async (req, res) => {
  // Business logic here
  const user = await User.create({...});
  res.json({...});
});
```

**After (Business logic in controller):**
```javascript
// routes/auth.js
router.post('/register', [...], asyncHandler(authController.register));

// controllers/authController.js
exports.register = async (req, res) => {
  // Business logic here
  const user = await User.create({...});
  return successResponse(res, {...});
};
```

## 📋 Response Format

All controllers use the standardized response formatter:

```javascript
// Success response
return successResponse(res, data, 'Message', statusCode);

// Error response
return errorResponse(res, 'Error message', statusCode, errors);

// Paginated response
return paginatedResponse(res, data, pagination, 'Message');
```

## 🛠️ Usage Example

### Creating a New Controller

1. Create controller file: `Backend/controllers/myController.js`
```javascript
const { successResponse, errorResponse } = require('../utils/responseFormatter');
const MyModel = require('../models/MyModel');

exports.getItems = async (req, res) => {
  try {
    const items = await MyModel.find();
    return successResponse(res, items, 'Items retrieved successfully');
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};
```

2. Update route file: `Backend/routes/myRoutes.js`
```javascript
const express = require('express');
const { protect } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');
const myController = require('../controllers/myController');

const router = express.Router();

router.get('/', protect, asyncHandler(myController.getItems));

module.exports = router;
```

## ✅ Best Practices

1. **Controllers should be thin**: Only business logic, no routing concerns
2. **Use asyncHandler**: Wrap all controller functions with asyncHandler
3. **Consistent responses**: Always use response formatter
4. **Error handling**: Use try-catch or let asyncHandler handle errors
5. **Single responsibility**: Each controller function should do one thing
6. **Validation**: Keep validation in routes, business logic in controllers

## 🔍 Testing Controllers

Controllers can now be easily unit tested:

```javascript
const authController = require('../controllers/authController');

describe('Auth Controller', () => {
  it('should register a new user', async () => {
    const req = { body: { email: 'test@test.com', password: '123456' } };
    const res = { status: jest.fn(), json: jest.fn() };
    
    await authController.register(req, res);
    
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

## 📚 File Structure Summary

- **Routes**: Define endpoints, validation, middleware, and call controllers
- **Controllers**: Handle business logic, database operations, and return responses
- **Models**: Define database schemas and methods
- **Middleware**: Handle cross-cutting concerns (auth, validation, etc.)
- **Utils**: Reusable utility functions (response formatter, logger, etc.)

This structure makes the codebase more maintainable, testable, and scalable!
