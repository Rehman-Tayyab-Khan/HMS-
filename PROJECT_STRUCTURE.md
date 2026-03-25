# 📁 HMS Project Structure

**Last Updated:** 2026-01-27

---

## 🏗️ Root Directory Structure

```
HMS/
├── README.md                    # Main project overview
├── START_HERE.md                # Quick start guide for production
├── PROJECT_STRUCTURE.md          # This file - project structure overview
├── docker-compose.yml           # Docker Compose configuration
├── .dockerignore                # Docker ignore patterns
├── .gitignore                   # Git ignore patterns
│
├── .github/                     # GitHub configuration
│   └── workflows/
│       └── ci.yml               # CI/CD pipeline
│
├── Backend/                     # Backend application (Node.js/Express)
│   ├── server.js                # Application entry point
│   ├── package.json             # Backend dependencies
│   ├── .env.example             # Environment variables template
│   ├── .eslintrc.js             # ESLint configuration
│   ├── ecosystem.config.js      # PM2 configuration
│   ├── Dockerfile               # Backend Docker image
│   ├── docker-compose.yml       # Backend Docker Compose
│   ├── init-mongo.js            # MongoDB Docker init script
│   │
│   ├── config/                  # Configuration files
│   │   ├── database.js          # Database connection & pooling
│   │   ├── helmet.js            # Security headers configuration
│   │   ├── swagger.js           # API documentation config
│   │   └── index.js             # Config exports
│   │
│   ├── constants/               # Application constants
│   │   └── index.js             # All constants (roles, statuses)
│   │
│   ├── controllers/            # Business logic (MVC Controllers)
│   │   ├── authController.js
│   │   ├── patientController.js
│   │   ├── staffController.js
│   │   ├── appointmentController.js
│   │   ├── medicalRecordController.js
│   │   ├── wardController.js
│   │   ├── reportController.js
│   │   └── index.js             # Controller exports
│   │
│   ├── middleware/             # Express middleware
│   │   ├── auth.js              # Authentication & authorization
│   │   ├── errorHandler.js      # Global error handler
│   │   ├── asyncHandler.js      # Async error wrapper
│   │   ├── pagination.js        # Pagination middleware
│   │   ├── rateLimiter.js       # Rate limiting
│   │   ├── security.js          # Enhanced security middleware
│   │   ├── requestValidator.js  # Request validation
│   │   ├── requestId.js         # Request ID tracking
│   │   ├── performanceMonitor.js # Performance tracking
│   │   ├── queryOptimizer.js    # Query optimization
│   │   ├── validateObjectId.js  # ObjectId validation
│   │   └── index.js             # Middleware exports
│   │
│   ├── models/                 # Database models (Mongoose)
│   │   ├── User.js
│   │   ├── Staff.js
│   │   ├── Patient.js
│   │   ├── Appointment.js
│   │   ├── MedicalRecord.js
│   │   ├── Ward.js
│   │   └── index.js             # Model exports
│   │
│   ├── routes/                  # API routes
│   │   ├── auth.js
│   │   ├── patients.js
│   │   ├── staff.js
│   │   ├── appointments.js
│   │   ├── medicalRecords.js
│   │   ├── wards.js
│   │   ├── reports.js
│   │   └── index.js             # Route exports
│   │
│   ├── utils/                  # Utility functions
│   │   ├── logger.js            # Logger entry point
│   │   ├── enhancedLogger.js    # Production logger with rotation
│   │   ├── cache.js             # Caching utilities
│   │   ├── retry.js             # Retry logic & circuit breaker
│   │   ├── monitoring.js        # System monitoring
│   │   ├── emailService.js      # Email service
│   │   ├── responseFormatter.js # Response formatting
│   │   └── index.js             # Utility exports
│   │
│   ├── validators/             # Validation schemas
│   │   └── index.js             # Validator exports
│   │
│   ├── scripts/                # Utility scripts
│   │   ├── start-production.js  # Production startup script
│   │   ├── verify-production.js # Production verification
│   │   ├── optimize-db.js       # Database optimization
│   │   ├── backup.js            # Database backup
│   │   └── restore.js           # Database restore
│   │
│   └── logs/                   # Application logs (auto-created)
│       ├── error.log
│       ├── warn.log
│       ├── info.log
│       └── debug.log
│
├── Frontend/                   # Frontend application (Angular)
│   └── HMS/
│       ├── package.json         # Frontend dependencies
│       ├── angular.json         # Angular CLI configuration
│       ├── tsconfig.json        # TypeScript configuration
│       ├── Dockerfile           # Frontend Docker image
│       ├── nginx.conf           # Nginx configuration
│       │
│       └── src/
│           ├── main.ts          # Application entry point
│           ├── index.html       # HTML template
│           ├── styles.scss      # Global styles
│           │
│           ├── environments/    # Environment configurations
│           │   ├── environment.ts
│           │   └── environment.prod.ts
│           │
│           ├── theme/           # SCSS theme system
│           │   ├── _variables.scss  # Theme variables
│           │   ├── _mixins.scss     # Theme mixins
│           │   ├── index.scss       # Theme entry point
│           │   └── README.md        # Theme documentation
│           │
│           └── app/
│               ├── app.component.ts
│               ├── app.config.ts    # App configuration
│               ├── app.routes.ts    # Route definitions
│               │
│               ├── Auth/            # Authentication components
│               │   ├── login/
│               │   └── signup/
│               │
│               ├── Dashboard/       # Dashboard component
│               │
│               ├── Pages/           # Feature pages
│               │   ├── landing/
│               │   ├── patients/
│               │   ├── appointments/
│               │   ├── medical-records/
│               │   ├── wards/
│               │   ├── staff/
│               │   ├── reports/
│               │   ├── profile/
│               │   └── complete-profile/
│               │
│               ├── Shared/          # Shared components
│               │   └── navbar/
│               │
│               ├── coreservices/    # API services
│               │   ├── api.service.ts
│               │   ├── auth.service.ts
│               │   ├── patient.service.ts
│               │   ├── appointment.service.ts
│               │   ├── medical-record.service.ts
│               │   ├── staff.service.ts
│               │   ├── ward.service.ts
│               │   ├── report.service.ts
│               │   └── index.ts
│               │
│               ├── coreguards/      # Route guards
│               │   ├── auth.guard.ts
│               │   ├── role.guard.ts
│               │   ├── profile-complete.guard.ts
│               │   ├── error-boundary.guard.ts
│               │   └── index.ts
│               │
│               └── coreinterceptors/ # HTTP interceptors
│                   ├── auth.interceptor.ts
│                   └── error.interceptor.ts
│
└── docs/                       # Project documentation
    ├── README.md                # Documentation index
    ├── DEPLOYMENT.md            # Deployment guide
    ├── DEVELOPMENT.md           # Development guide
    ├── SECURITY.md              # Security guide
    ├── PRODUCTION_READY.md      # Production features
    ├── PROJECT_STATUS.md        # Project status
    ├── FINAL_CHECKLIST.md       # Production checklist
    ├── SETUP.md                 # Setup instructions
    ├── QUICK_START.md           # Quick start guide
    ├── PRODUCTION_CHECKLIST.md  # Pre-deployment checklist
    ├── PRODUCTION_DEPLOYMENT.md # Production deployment
    ├── ADDITIONAL_FEATURES.md   # Additional features
    ├── CONTROLLER_STRUCTURE.md  # Controller architecture
    └── FOLDER_STRUCTURE.md      # Backend folder structure
```

---

## 📋 Key Directories

### Backend Structure
- **`config/`** - Configuration files (database, security, swagger)
- **`controllers/`** - Business logic layer (MVC pattern)
- **`middleware/`** - Express middleware (auth, errors, validation)
- **`models/`** - Mongoose schemas and models
- **`routes/`** - API route definitions
- **`utils/`** - Utility functions (logger, cache, retry, monitoring)
- **`validators/`** - Reusable validation schemas
- **`scripts/`** - Utility scripts (backup, restore, optimization)

### Frontend Structure
- **`app/Auth/`** - Authentication components
- **`app/Dashboard/`** - Dashboard component
- **`app/Pages/`** - Feature pages (patients, appointments, etc.)
- **`app/Shared/`** - Shared components (navbar, etc.)
- **`app/coreservices/`** - API service layer
- **`app/coreguards/`** - Route protection guards
- **`app/coreinterceptors/`** - HTTP interceptors
- **`theme/`** - SCSS theme system (variables, mixins)

### Documentation Structure
- **`docs/`** - All project documentation organized by topic
- **Root level** - Only essential files (README.md, START_HERE.md)

---

## 🎯 Best Practices

1. **Centralized Exports** - All folders use `index.js/ts` for clean imports
2. **Separation of Concerns** - Clear separation between routes, controllers, and models
3. **Reusable Components** - Shared utilities, validators, and middleware
4. **Documentation** - Comprehensive docs organized in `docs/` folder
5. **Configuration** - Environment-based configuration with `.env` files
6. **Scripts** - Utility scripts for common tasks (backup, restore, optimization)

---

## 📚 Documentation Files

### Root Level (Essential Only)
- `README.md` - Main project overview
- `START_HERE.md` - Quick start guide
- `PROJECT_STRUCTURE.md` - This file

### Documentation Folder (`docs/`)
All detailed documentation is organized in the `docs/` folder. See [docs/README.md](./docs/README.md) for the complete index.

---

**This structure ensures:**
- ✅ Clean organization
- ✅ Easy navigation
- ✅ Scalable architecture
- ✅ Maintainable codebase
- ✅ Professional structure
