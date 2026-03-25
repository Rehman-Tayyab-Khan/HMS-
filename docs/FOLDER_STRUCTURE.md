# Backend Folder Structure

## 📁 Directory Organization

```
Backend/
├── config/                 # Configuration files
│   ├── index.js           # Config exports
│   └── swagger.js         # Swagger/OpenAPI configuration
│
├── constants/             # Application constants
│   └── index.js          # All constants (roles, statuses, etc.)
│
├── controllers/           # Business logic (MVC Controllers)
│   ├── index.js          # Controller exports
│   ├── authController.js
│   ├── patientController.js
│   ├── staffController.js
│   ├── appointmentController.js
│   ├── medicalRecordController.js
│   ├── wardController.js
│   └── reportController.js
│
├── middleware/            # Express middleware
│   ├── index.js          # Middleware exports
│   ├── auth.js           # Authentication & authorization
│   ├── asyncHandler.js   # Async error handler wrapper
│   ├── errorHandler.js   # Global error handler
│   ├── pagination.js     # Pagination middleware
│   ├── rateLimiter.js    # Rate limiting
│   ├── requestId.js      # Request ID tracking
│   └── validateObjectId.js # ObjectId validation
│
├── models/                # Database models (Mongoose schemas)
│   ├── index.js          # Model exports
│   ├── User.js
│   ├── Staff.js
│   ├── Patient.js
│   ├── Appointment.js
│   ├── MedicalRecord.js
│   └── Ward.js
│
├── routes/                # API routes (thin layer)
│   ├── index.js          # Route exports
│   ├── auth.js
│   ├── patients.js
│   ├── staff.js
│   ├── appointments.js
│   ├── medicalRecords.js
│   ├── wards.js
│   └── reports.js
│
├── scripts/               # Utility scripts
│   ├── backup.js         # Database backup
│   └── restore.js        # Database restore
│
├── utils/                 # Utility functions
│   ├── index.js          # Utility exports
│   ├── logger.js         # Logging utility
│   ├── emailService.js   # Email service
│   └── responseFormatter.js # API response formatter
│
├── validators/            # Validation schemas
│   └── index.js          # Validation exports
│
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── .dockerignore         # Docker ignore rules
├── docker-compose.yml    # Docker Compose config
├── Dockerfile            # Docker image config
├── ecosystem.config.js   # PM2 configuration
├── package.json          # Dependencies
├── server.js             # Application entry point
└── README.md             # Documentation
```

## 🎯 Architecture Pattern

The backend follows **MVC (Model-View-Controller)** architecture:

- **Models**: Database schemas and data access
- **Controllers**: Business logic and request handling
- **Routes**: Endpoint definitions and middleware chaining

## 📦 Module Organization

### Index Files
Each folder has an `index.js` for easier imports:

```javascript
// Before
const { protect, authorize } = require('../middleware/auth');
const asyncHandler = require('../middleware/asyncHandler');

// After
const { protect, authorize, asyncHandler } = require('../middleware');
```

### Constants
All application constants are centralized:

```javascript
const { ROLES, APPOINTMENT_STATUS } = require('../constants');

if (user.role === ROLES.ADMIN) { ... }
```

### Validators
Reusable validation schemas:

```javascript
const { registerValidation, patientValidation } = require('../validators');

router.post('/register', registerValidation, controller.register);
```

## 🔄 Import Examples

### Using Index Files

```javascript
// Controllers
const { authController, patientController } = require('../controllers');

// Middleware
const { protect, authorize, asyncHandler } = require('../middleware');

// Models
const { User, Patient, Appointment } = require('../models');

// Utils
const { logger, successResponse, errorResponse } = require('../utils');

// Constants
const { ROLES, APPOINTMENT_STATUS } = require('../constants');

// Validators
const { registerValidation, patientValidation } = require('../validators');
```

## ✅ Best Practices

1. **Separation of Concerns**: Each folder has a specific purpose
2. **Index Files**: Use index.js for cleaner imports
3. **Constants**: Centralize all constants in one place
4. **Validators**: Reusable validation schemas
5. **Naming**: Consistent naming conventions
6. **Single Responsibility**: Each file has one clear purpose

## 🚀 Benefits

- **Maintainability**: Easy to find and modify code
- **Scalability**: Easy to add new features
- **Testability**: Clear separation makes testing easier
- **Readability**: Organized structure is self-documenting
- **Reusability**: Shared utilities and constants
