# Development Guide

Complete guide for developers working on the Hospital Management System.

## 📁 Project Structure

### Backend Architecture

The backend follows **MVC (Model-View-Controller)** pattern:

```
Backend/
├── config/              # Configuration files
│   ├── index.js
│   └── swagger.js      # API documentation config
│
├── constants/          # Application constants
│   └── index.js        # Roles, statuses, enums
│
├── controllers/        # Business logic (MVC)
│   ├── index.js
│   ├── authController.js
│   ├── patientController.js
│   ├── staffController.js
│   ├── appointmentController.js
│   ├── medicalRecordController.js
│   ├── wardController.js
│   └── reportController.js
│
├── middleware/         # Express middleware
│   ├── index.js
│   ├── auth.js         # Authentication & authorization
│   ├── asyncHandler.js # Async error wrapper
│   ├── errorHandler.js # Global error handler
│   ├── pagination.js   # Pagination middleware
│   ├── rateLimiter.js  # Rate limiting
│   ├── requestId.js    # Request tracking
│   └── validateObjectId.js
│
├── models/            # Mongoose schemas
│   ├── index.js
│   ├── User.js
│   ├── Staff.js
│   ├── Patient.js
│   ├── Appointment.js
│   ├── MedicalRecord.js
│   └── Ward.js
│
├── routes/            # API routes (thin layer)
│   ├── index.js
│   ├── auth.js
│   ├── patients.js
│   ├── staff.js
│   ├── appointments.js
│   ├── medicalRecords.js
│   ├── wards.js
│   └── reports.js
│
├── scripts/           # Utility scripts
│   ├── backup.js      # Database backup
│   └── restore.js     # Database restore
│
├── utils/             # Utility functions
│   ├── index.js
│   ├── logger.js      # Logging utility
│   ├── emailService.js
│   └── responseFormatter.js
│
└── validators/        # Validation schemas
    └── index.js
```

### Frontend Architecture

```
Frontend/HMS/src/app/
├── Auth/              # Authentication components
│   ├── login/
│   └── signup/
├── Dashboard/         # Dashboard component
├── Pages/             # Feature pages
│   ├── patients/
│   ├── appointments/
│   ├── medical-records/
│   ├── wards/
│   ├── staff/
│   ├── reports/
│   └── profile/
├── coreservices/      # API services
├── coreguards/        # Route guards
└── coreinterceptors/  # HTTP interceptors
```

## 🎯 Code Organization

### Using Index Files

All folders have `index.js` for cleaner imports:

```javascript
// Instead of multiple requires
const { protect, authorize, asyncHandler } = require('../middleware');
const { User, Patient } = require('../models');
const { successResponse } = require('../utils');
```

### Constants

Centralized constants:

```javascript
const { ROLES, APPOINTMENT_STATUS } = require('../constants');

if (user.role === ROLES.ADMIN) { ... }
```

### Validators

Reusable validation schemas:

```javascript
const { registerValidation, patientValidation } = require('../validators');

router.post('/', [...registerValidation], handler);
```

## 📝 Controller Structure

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
const { protect } = require('../middleware');
const asyncHandler = require('../middleware/asyncHandler');
const myController = require('../controllers/myController');

const router = express.Router();

router.get('/', protect, asyncHandler(myController.getItems));

module.exports = router;
```

### Response Format

All controllers use standardized response formatter:

```javascript
// Success response
return successResponse(res, data, 'Message', statusCode);

// Error response
return errorResponse(res, 'Error message', statusCode, errors);

// Paginated response
return paginatedResponse(res, data, pagination, 'Message');
```

## 🔧 Additional Features

### 1. Database Indexes

Performance optimization with indexes on all models:
- User: email, role, staffId, isActive, profileCompleted
- Staff: employeeId, email, role, department, status, name
- Patient: patientId, email, status, name, dateOfBirth
- Appointment: appointmentId, patient, doctor, date, status
- MedicalRecord: recordId, patient, doctor, visitDate
- Ward/Bed: wardNumber, wardType, status, bedNumber

### 2. Pagination Middleware

Location: `Backend/middleware/pagination.js`

Usage:
```javascript
router.get('/', protect, paginate, asyncHandler(async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const total = await Model.countDocuments();
  const data = await Model.find().skip(skip).limit(limit);
  
  res.json(createPaginatedResponse(data, total, req.pagination));
}));
```

### 3. Swagger/OpenAPI Documentation

Location: `Backend/config/swagger.js`
Access: http://localhost:3000/api-docs (development)

Enable in Production:
```env
ENABLE_SWAGGER=true
```

### 4. Email Service Template

Location: `Backend/utils/emailService.js`

Features:
- Welcome emails
- Password reset emails
- Appointment confirmations
- Ready for integration with Nodemailer, SendGrid, AWS SES, etc.

Setup:
1. Install nodemailer: `npm install nodemailer`
2. Configure SMTP in `.env`
3. Set `EMAIL_ENABLED=true`

### 5. Database Backup Script

Location: `Backend/scripts/backup.js`

Usage:
```bash
npm run backup              # Standard backup
npm run backup:compress     # Compressed backup
node scripts/backup.js --output /custom/path
```

Features:
- Automated backups
- Compression support
- Automatic cleanup (keeps last 7 days)
- Timestamped backups

### 6. API Response Standardization

Location: `Backend/utils/responseFormatter.js`

Functions:
- `successResponse()` - Standard success response
- `errorResponse()` - Standard error response
- `paginatedResponse()` - Paginated list response

Example:
```javascript
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// Success
return successResponse(res, data, 'User created', 201);

// Error
return errorResponse(res, 'User not found', 404);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/change-password` - Change password
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/logout` - Logout

### Staff
- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get single staff member
- `POST /api/staff` - Create new staff (Admin/Management)
- `PUT /api/staff/:id` - Update staff (Admin/Management)
- `DELETE /api/staff/:id` - Delete staff (Admin only)

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get single patient
- `POST /api/patients` - Create new patient
- `PUT /api/patients/:id` - Update patient
- `DELETE /api/patients/:id` - Delete patient (Admin/Management)

### Appointments
- `GET /api/appointments` - Get all appointments
- `GET /api/appointments/:id` - Get single appointment
- `POST /api/appointments` - Create new appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Medical Records
- `GET /api/medical-records` - Get all medical records
- `GET /api/medical-records/:id` - Get single record
- `POST /api/medical-records` - Create new record (Doctor only)
- `PUT /api/medical-records/:id` - Update record (Doctor only)

### Wards
- `GET /api/wards` - Get all wards
- `GET /api/wards/:id` - Get single ward with beds
- `POST /api/wards` - Create new ward (Admin/Management)
- `PUT /api/wards/:id` - Update ward (Admin/Management)
- `GET /api/wards/:id/beds` - Get beds for a ward
- `POST /api/wards/:id/beds` - Assign patient to bed
- `PUT /api/wards/beds/:bedId/discharge` - Discharge patient

### Reports
- `GET /api/reports/dashboard` - Get dashboard statistics (Admin/Management)
- `GET /api/reports/appointments` - Get appointment reports
- `GET /api/reports/patients` - Get patient reports
- `GET /api/reports/wards` - Get ward occupancy reports

## 🔐 Role-Based Access Control

### User Roles

1. **Admin**: Full system access, can manage all modules
2. **Management**: Access to reports, staff management, and administrative functions
3. **Doctor**: Can manage appointments, medical records, and view patient information
4. **Nurse**: Can view appointments, manage wards, and view patient information

### Route Protection

Frontend routes are protected with guards:
- `authGuard` - Ensures user is authenticated
- `roleGuard` - Checks user has required role(s)
- `profileCompleteGuard` - Ensures profile is completed

Example:
```typescript
{
  path: 'staff',
  loadComponent: () => import('./Pages/staff/staff.component').then(m => m.StaffComponent),
  canActivate: [authGuard, profileCompleteGuard, roleGuard(['admin', 'management'])]
}
```

## 🧪 Testing

### Backend Testing

```bash
# Run tests (when implemented)
npm test

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

### Frontend Testing

```bash
# Run tests
npm test

# Run linter
npm run lint
```

## 🚀 CI/CD Pipeline

Location: `.github/workflows/ci.yml`

Features:
- Automated testing on push/PR
- Backend and frontend builds
- Security audits
- Docker build tests
- MongoDB service for testing

Triggers:
- Push to main/develop branches
- Pull requests

## 📚 Next Steps

### Recommended Additions:
1. **Unit Tests**: Jest/Mocha for backend, Jasmine for frontend
2. **Integration Tests**: API endpoint testing
3. **E2E Tests**: Cypress or Playwright
4. **Redis Caching**: For sessions and frequently accessed data
5. **File Upload**: Multer for document/image uploads
6. **WebSocket**: For real-time notifications
7. **Audit Logging**: Track all user actions
8. **API Versioning**: `/api/v1/` for future compatibility

### Performance Optimizations:
1. **Query Optimization**: Use `.select()` to limit fields
2. **Aggregation Pipelines**: For complex reports
3. **Connection Pooling**: Already configured in Mongoose
4. **CDN**: For static assets
5. **Caching Layer**: Redis for hot data

## ✅ Best Practices

1. **Controllers should be thin**: Only business logic, no routing concerns
2. **Use asyncHandler**: Wrap all controller functions with asyncHandler
3. **Consistent responses**: Always use response formatter
4. **Error handling**: Use try-catch or let asyncHandler handle errors
5. **Single responsibility**: Each controller function should do one thing
6. **Validation**: Keep validation in routes, business logic in controllers
7. **Separation of Concerns**: Each folder has a specific purpose
8. **Naming**: Consistent naming conventions
