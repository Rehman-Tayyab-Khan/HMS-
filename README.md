# Hospital Management System (HMS)

A comprehensive, production-ready web-based Hospital Management System developed using the MEAN stack (MongoDB, Express.js, Angular, and Node.js) to streamline and automate hospital operations for internal staff.

## 🚀 Production Ready Features

- ✅ **Security**: Helmet, rate limiting, XSS protection, NoSQL injection prevention
- ✅ **Error Handling**: Comprehensive error handling middleware
- ✅ **Logging**: Request logging with Morgan
- ✅ **Validation**: Input validation and sanitization
- ✅ **Performance**: Compression, connection pooling
- ✅ **Monitoring**: Health check endpoints
- ✅ **Docker**: Docker and Docker Compose support
- ✅ **Process Management**: PM2 configuration included

## Features

- **Role-Based Access Control**: Secure access for doctors, nurses, management, and administrators
- **Staff Management**: Complete staff information and management system
- **Patient Management**: Patient records, medical history, and information management
- **Appointment Scheduling**: Schedule, manage, and track patient appointments
- **Medical Records**: Comprehensive medical record keeping and management
- **Ward Management**: Ward and bed assignment system
- **Reporting & Analytics**: Dashboard with statistics and reports for management
- **Responsive UI**: Modern, user-friendly interface that works on all devices

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** for database
- **Mongoose** for ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Express Validator** for input validation
- **Helmet** for security headers
- **Swagger** for API documentation

### Frontend
- **Angular 19** (Standalone components)
- **TypeScript**
- **SCSS** for styling
- **RxJS** for reactive programming

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Make sure MongoDB is running on your system
- npm or yarn

## Installation

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the Backend directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hms
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The backend server will run on `http://localhost:3000`

### Frontend Setup

1. Navigate to the Frontend/HMS directory:
```bash
cd Frontend/HMS
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend application will run on `http://localhost:4200`

## Project Structure

```
HMS/
├── Backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication middleware
│   └── server.js        # Express server entry point
│
└── Frontend/
    └── HMS/
        └── src/
            └── app/
                ├── Auth/           # Authentication components
                ├── Dashboard/      # Dashboard component
                ├── Pages/          # Feature pages
                ├── coreservices/   # API services
                ├── coreguards/     # Route guards
                └── coreinterceptors/ # HTTP interceptors
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user

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

## User Roles

1. **Admin**: Full system access, can manage all modules
2. **Management**: Access to reports, staff management, and administrative functions
3. **Doctor**: Can manage appointments, medical records, and view patient information
4. **Nurse**: Can view appointments, manage wards, and view patient information

## Getting Started

1. Make sure MongoDB is running on your system
2. Start the backend server (from Backend directory)
3. Start the frontend development server (from Frontend/HMS directory)
4. Open your browser and navigate to `http://localhost:4200`
5. You'll need to create a user account through the API or directly in MongoDB

## Creating the First Admin User

To create the first admin user, you can use the registration endpoint or create it directly in MongoDB:

1. Create a staff member first (via API or MongoDB)
2. Then create a user account linked to that staff member with role 'admin'

Example using MongoDB:
```javascript
// First create a staff member
db.staffs.insertOne({
  employeeId: "EMP000001",
  firstName: "Admin",
  lastName: "User",
  email: "admin@hms.com",
  phone: "1234567890",
  dateOfBirth: new Date("1990-01-01"),
  role: "admin",
  department: "Administration",
  status: "active"
})

// Then create a user (password will be hashed automatically)
// Note: You'll need to hash the password using bcrypt
```

## Development

- Backend uses Express.js with MongoDB
- Frontend uses Angular 19 with standalone components
- All API calls are authenticated using JWT tokens
- Role-based access control is implemented on both frontend and backend

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based route protection
- HTTP interceptors for automatic token attachment
- Input validation using express-validator

## Future Enhancements

- Real-time notifications
- Advanced reporting and analytics
- Email notifications
- File uploads for medical documents
- Integration with external systems
- Mobile app support

## License

This project is for educational and internal use purposes.

## 📚 Documentation

### Quick Start
- **[START_HERE.md](./START_HERE.md)** - Quick start guide for production deployment
- **[Project Structure](./PROJECT_STRUCTURE.md)** - Complete project structure overview

### Comprehensive Documentation
For detailed documentation, see the [docs](./docs/) folder:

- **[Documentation Index](./docs/README.md)** - Complete documentation index
- **[Deployment Guide](./docs/DEPLOYMENT.md)** - Complete setup and deployment instructions
- **[Development Guide](./docs/DEVELOPMENT.md)** - Developer documentation and architecture
- **[Security Guide](./docs/SECURITY.md)** - Security features and best practices
- **[Production Status](./docs/PROJECT_STATUS.md)** - Current project status and verification
- **[Production Checklist](./docs/FINAL_CHECKLIST.md)** - Production readiness checklist

## Support

For issues or questions, please contact the development team.
