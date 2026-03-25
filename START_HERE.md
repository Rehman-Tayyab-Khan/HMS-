# 🚀 HMS Production Startup Guide

## ⚠️ CRITICAL: $10,000 Protection Setup

This guide ensures your HMS system is production-ready with enterprise-grade security, performance, and reliability.

---

## 📋 Quick Start (5 Minutes)

### Step 1: Install Dependencies

```bash
# Backend
cd Backend
npm install

# Frontend (in new terminal)
cd Frontend/HMS
npm install
```

### Step 2: Configure Environment

**Backend** - Copy and edit `.env`:
```bash
cd Backend
cp .env.example .env
# Edit .env with your production values
```

**Required Environment Variables:**
```env
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin
JWT_SECRET=your_very_strong_random_secret_min_32_characters_long
JWT_EXPIRE=7d
FRONTEND_URL=https://your-domain.com
TRUST_PROXY=true
```

**Frontend** - Update `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

### Step 3: Verify Production Readiness

```bash
cd Backend
npm run verify
```

This checks:
- ✅ Environment variables
- ✅ Critical files
- ✅ Dependencies
- ✅ Database connection
- ✅ Security configuration

### Step 4: Start Backend

```bash
cd Backend
npm start
```

Or with PM2 (recommended for production):
```bash
npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 5: Build & Serve Frontend

```bash
cd Frontend/HMS
npm run build:prod
# Serve with nginx or your preferred server
```

---

## 🛡️ Security Checklist (MUST DO)

- [ ] **Change JWT_SECRET** - Use a strong random string (32+ characters)
- [ ] **MongoDB Authentication** - Use connection string with credentials
- [ ] **HTTPS** - Enable SSL/TLS certificates
- [ ] **CORS** - Set FRONTEND_URL to your production domain only
- [ ] **Firewall** - Restrict access to necessary ports only
- [ ] **Rate Limiting** - Already configured, review limits if needed
- [ ] **Environment Variables** - Never commit `.env` files
- [ ] **Dependencies** - Run `npm audit fix` regularly

---

## ⚡ Performance Optimizations (Already Implemented)

✅ **Backend:**
- Connection pooling (5-10 connections)
- Response caching (5 minutes)
- Query optimization (lean queries, pagination)
- Compression (gzip)
- Database indexes
- Performance monitoring

✅ **Frontend:**
- Production build optimization
- Lazy loading routes
- Tree shaking
- Minification
- Asset optimization

---

## 📊 Monitoring Endpoints

- **Health Check:** `GET /api/health`
- **Metrics:** `GET /api/metrics`
- **API Docs:** `GET /api-docs` (if enabled)

---

## 🔧 Production Commands

```bash
# Backend
npm start              # Start with production checks
npm run verify         # Verify production readiness
npm run optimize-db    # Optimize database indexes
npm run health-check   # Check system health
npm run lint           # Check code quality

# Frontend
npm run build:prod     # Production build
npm run lint           # Check code quality
```

---

## 🚨 Critical Production Notes

### 1. Database
- **MUST** use MongoDB with authentication
- **MUST** set up regular backups
- Run `npm run optimize-db` after deployment
- Monitor connection pool usage

### 2. Logging
- Logs are in `Backend/logs/`
- Automatic rotation (10MB max, 10 files)
- Structured JSON format
- Monitor error rates regularly

### 3. Error Handling
- All errors are logged
- No sensitive data in error responses
- Global error handler active
- Retry mechanisms in place

### 4. Scalability
- Stateless API design (ready for horizontal scaling)
- Connection pooling configured
- Caching layer (upgrade to Redis for multi-instance)
- PM2 cluster mode ready

---

## 📈 System Requirements

**Minimum:**
- Node.js >= 16.0.0
- MongoDB >= 4.4
- 2GB RAM
- 10GB Storage

**Recommended:**
- Node.js >= 18.0.0
- MongoDB >= 5.0
- 4GB+ RAM
- 20GB+ Storage
- Redis (for caching in multi-instance setup)

---

## 🔍 Troubleshooting

### Backend won't start
1. Check environment variables: `npm run verify`
2. Check MongoDB connection
3. Check logs: `Backend/logs/error.log`
4. Verify port 3000 is available

### Database connection fails
1. Verify MONGODB_URI format
2. Check MongoDB is running
3. Verify credentials
4. Check firewall rules

### CORS errors
1. Verify FRONTEND_URL in `.env`
2. Check CORS configuration in `server.js`
3. Ensure frontend URL matches exactly

### Performance issues
1. Check `/api/metrics` endpoint
2. Review slow queries in logs
3. Run `npm run optimize-db`
4. Check memory usage

---

## 📚 Additional Documentation

- **Documentation Index:** `docs/README.md` - Complete documentation index
- **Deployment:** `docs/DEPLOYMENT.md` - Complete deployment guide
- **Security:** `docs/SECURITY.md` - Security features and best practices
- **Development:** `docs/DEVELOPMENT.md` - Developer documentation
- **Production Status:** `docs/PROJECT_STATUS.md` - Current project status
- **Production Checklist:** `docs/FINAL_CHECKLIST.md` - Production readiness checklist
- **Project Structure:** `PROJECT_STRUCTURE.md` - Complete project structure overview

---

## ✅ Pre-Launch Checklist

- [ ] All environment variables set
- [ ] JWT_SECRET changed (32+ characters)
- [ ] MongoDB with authentication
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Frontend production build tested
- [ ] All API endpoints tested
- [ ] Health check working
- [ ] Logs directory writable
- [ ] PM2 or process manager configured
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Firewall configured
- [ ] `npm audit fix` run
- [ ] `npm run verify` passed

---

## 🎯 Your $10,000 Investment is Protected!

This system includes:
- ✅ Enterprise-grade error handling
- ✅ Comprehensive security measures
- ✅ Performance optimizations
- ✅ Monitoring and logging
- ✅ Scalability features
- ✅ Production-ready configuration

**For support or issues, check logs in `Backend/logs/`**

---

**Last Updated:** 2026-01-27
**Version:** 1.0.0
