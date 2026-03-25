# Quick Setup Guide

## Important: Create .env file

Since the `.env` file couldn't be created automatically, please create it manually:

1. Navigate to the `Backend` folder
2. Create a new file named `.env` (no extension)
3. Add the following content:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hms
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

## Running the Application

### Prerequisites
- MongoDB must be installed and running on your system
- Node.js (v16 or higher) installed

### Step 1: Start MongoDB
Make sure MongoDB is running on your system. If not, start it:
```bash
# Windows (if installed as service, it should start automatically)
# Or use: net start MongoDB

# Linux/Mac
mongod
```

### Step 2: Start Backend Server
Open a terminal and run:
```bash
cd Backend
npm install  # (if not already done)
npm start
```

The backend will run on `http://localhost:3000`

### Step 3: Start Frontend Server
Open another terminal and run:
```bash
cd Frontend/HMS
npm install  # (if not already done)
npm start
```

The frontend will run on `http://localhost:4200`

### Step 4: Access the Application
Open your browser and navigate to:
```
http://localhost:4200
```

## Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if MongoDB is listening on port 27017
- Verify the MONGODB_URI in your .env file

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: Use `ng serve --port 4201` or another port

### CORS Errors
- Make sure backend is running before frontend
- Check that backend CORS is enabled (it should be by default)

## First Time Setup

After starting both servers, you'll need to create your first user account. You can do this by:

1. Using the registration API endpoint (requires admin privileges)
2. Or creating directly in MongoDB (see main README.md)

The application is now running! 🎉
