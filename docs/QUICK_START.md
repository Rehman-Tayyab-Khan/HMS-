# Quick Start Guide

## 🚀 Development Setup (5 minutes)

### 1. Backend Setup
```bash
cd Backend
npm install
# Create .env file (copy from .env.example)
npm start
```

### 2. Frontend Setup
```bash
cd Frontend/HMS
npm install
npm start
```

### 3. Access Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health

## 📦 Production Deployment

### Option 1: Traditional Deployment

**Backend:**
```bash
cd Backend
npm install --production
# Configure .env file
pm2 start ecosystem.config.js
```

**Frontend:**
```bash
cd Frontend/HMS
npm install
npm run build:prod
# Deploy dist/hms/browser to web server
```

### Option 2: Docker Deployment

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔐 First Time Setup

1. **Start MongoDB**
   - Make sure MongoDB is running on your system

2. **Create .env file**
   ```bash
   cd Backend
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start Backend**
   ```bash
   npm start
   ```

4. **Start Frontend**
   ```bash
   cd Frontend/HMS
   npm start
   ```

5. **Sign Up**
   - Go to http://localhost:4200
   - Click "Sign Up"
   - Enter email and password
   - Complete your profile

## ✅ Verify Installation

1. Check backend health:
   ```bash
   curl http://localhost:3000/api/health
   ```

2. Check MongoDB connection:
   - Look for "✅ MongoDB Connected" in backend logs

3. Test frontend:
   - Open http://localhost:4200
   - Should see landing page

## 🐛 Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**Port Already in Use**
- Change PORT in .env (backend)
- Use different port for frontend: `ng serve --port 4201`

**CORS Errors**
- Check FRONTEND_URL in backend .env
- Ensure backend is running before frontend

**Module Not Found**
- Run `npm install` in both Backend and Frontend/HMS directories

## 📚 Next Steps

- Read [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md) for production setup
- Read [SECURITY.md](SECURITY.md) for security best practices
- Read [PRODUCTION_CHECKLIST.md](PRODUCTION_CHECKLIST.md) before deploying
