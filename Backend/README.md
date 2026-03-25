# HMS Backend

Hospital Management System Backend API built with Node.js, Express.js, and MongoDB.

## 📁 Project Structure

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
├── validators/        # Validation schemas
│   └── index.js
│
├── .env.example       # Environment template
├── server.js          # Application entry point
└── package.json
```

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hms
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:4200
```

### Run Development Server

```bash
npm run dev
```

### Run Production Server

```bash
npm start
```

## 📚 API Documentation

When running in development, visit:
- **Swagger UI**: http://localhost:3000/api-docs

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run backup` - Create database backup
- `npm run backup:compress` - Create compressed backup
- `npm run restore <path>` - Restore from backup

## 📦 Key Features

- ✅ MVC Architecture
- ✅ JWT Authentication
- ✅ Role-Based Access Control
- ✅ Input Validation
- ✅ Error Handling
- ✅ Rate Limiting
- ✅ Security Headers
- ✅ API Documentation (Swagger)
- ✅ Database Indexes
- ✅ Pagination Support

## 🔐 Security

- Helmet security headers
- Rate limiting
- XSS protection
- NoSQL injection prevention
- Input sanitization
- Password hashing (bcrypt)

## 📖 Documentation

For detailed documentation, see the [docs](../docs/) folder:

- [Development Guide](../docs/DEVELOPMENT.md) - Architecture and development guide
- [Deployment Guide](../docs/DEPLOYMENT.md) - Setup and deployment instructions
- [Security Guide](../docs/SECURITY.md) - Security features and best practices
- [Folder Structure](../docs/FOLDER_STRUCTURE.md) - Backend folder structure
- [Controller Structure](../docs/CONTROLLER_STRUCTURE.md) - Controller architecture

## 🏗️ Architecture

The backend follows **MVC (Model-View-Controller)** pattern:

- **Models**: Database schemas and data access
- **Controllers**: Business logic and request handling  
- **Routes**: Endpoint definitions and middleware

## 📝 Code Organization

### Using Index Files

All folders have `index.js` for cleaner imports:

```javascript
// Instead of multiple requires
const { protect, authorize } = require('../middleware');
const { User, Patient } = require('../models');
const { successResponse } = require('../utils');
```

### Constants

Centralized constants:

```javascript
const { ROLES, APPOINTMENT_STATUS } = require('../constants');
```

### Validators

Reusable validation schemas:

```javascript
const { registerValidation, patientValidation } = require('../validators');
```

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test
```

## 📄 License

ISC
