# Production Deployment Guide

## 🚀 Pre-Deployment Checklist

### Backend Requirements
- [x] Security middleware (Helmet, rate limiting)
- [x] Error handling middleware
- [x] Input validation and sanitization
- [x] CORS configuration
- [x] Environment variables
- [x] Database connection handling
- [x] Logging
- [x] Graceful shutdown

### Frontend Requirements
- [x] Production build configuration
- [x] Environment files
- [x] Error handling
- [x] API interceptors
- [x] Route guards

## 📦 Backend Production Setup

### 1. Install Production Dependencies

```bash
cd Backend
npm install --production
```

### 2. Environment Configuration

Create `.env` file in Backend directory:

```env
NODE_ENV=production
PORT=3000

# MongoDB - Use connection string with authentication
MONGODB_URI=mongodb://username:password@host:port/database?authSource=admin

# JWT - Use a strong, random secret (at least 32 characters)
JWT_SECRET=your_very_strong_random_secret_key_here_min_32_chars
JWT_EXPIRE=7d

# Frontend URL for CORS
FRONTEND_URL=https://your-domain.com

# Trust proxy (if behind reverse proxy)
TRUST_PROXY=true
```

### 3. Security Checklist

- ✅ Change default JWT_SECRET to a strong random string
- ✅ Use MongoDB with authentication
- ✅ Configure CORS to only allow your frontend domain
- ✅ Enable rate limiting
- ✅ Use HTTPS in production
- ✅ Set up reverse proxy (Nginx/Apache)
- ✅ Enable firewall rules
- ✅ Regular security updates

### 4. Start Production Server

```bash
# Using PM2 (recommended)
npm install -g pm2
pm2 start server.js --name hms-backend

# Or using Node directly
NODE_ENV=production node server.js
```

### 5. PM2 Configuration (Recommended)

Create `ecosystem.config.js`:

```javascript
module.exports = {
  apps: [{
    name: 'hms-backend',
    script: './server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## 🎨 Frontend Production Setup

### 1. Build for Production

```bash
cd Frontend/HMS
npm install
npm run build:prod
```

This creates optimized production build in `dist/hms/` directory.

### 2. Update Production Environment

Edit `src/environments/environment.prod.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

### 3. Serve Production Build

#### Option A: Using Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/Frontend/HMS/dist/hms/browser;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Option B: Using Node.js (Express)

Create `Frontend/HMS/server.js`:

```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'dist/hms/browser')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/hms/browser/index.html'));
});

const port = process.env.PORT || 4200;
app.listen(port, () => {
  console.log(`Frontend server running on port ${port}`);
});
```

## 🔒 Security Best Practices

### 1. Environment Variables
- Never commit `.env` files
- Use different secrets for development and production
- Rotate JWT secrets periodically

### 2. Database Security
- Use MongoDB authentication
- Enable SSL/TLS for database connections
- Regular backups
- Use connection pooling

### 3. API Security
- Rate limiting enabled ✅
- Input validation ✅
- XSS protection ✅
- NoSQL injection protection ✅
- CORS properly configured ✅

### 4. Server Security
- Use HTTPS (SSL/TLS certificates)
- Keep dependencies updated
- Regular security audits
- Use reverse proxy (Nginx)
- Enable firewall

## 📊 Monitoring & Logging

### Backend Logging
- Morgan for HTTP request logging
- Error logging to files
- Use PM2 logs: `pm2 logs hms-backend`

### Health Checks
- Endpoint: `GET /api/health`
- Monitor server status
- Set up uptime monitoring

## 🚀 Deployment Steps

### 1. Prepare Server
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install MongoDB
# Follow MongoDB installation guide for your OS

# Install PM2
sudo npm install -g pm2
```

### 2. Deploy Backend
```bash
cd /path/to/HMS/Backend
npm install --production
# Create .env file with production values
pm2 start server.js --name hms-backend
pm2 save
```

### 3. Deploy Frontend
```bash
cd /path/to/HMS/Frontend/HMS
npm install
npm run build:prod
# Serve using Nginx or Node.js server
```

### 4. Configure Nginx (Recommended)
- Set up SSL certificates (Let's Encrypt)
- Configure reverse proxy
- Enable gzip compression
- Set up caching

## 🔍 Performance Optimization

### Backend
- ✅ Compression middleware enabled
- ✅ Connection pooling
- ✅ Database indexing
- ✅ Query optimization

### Frontend
- ✅ Production build with minification
- ✅ Tree shaking
- ✅ Lazy loading routes
- ✅ Asset optimization

## 📝 Environment Variables Reference

### Backend (.env)
```
NODE_ENV=production
PORT=3000
MONGODB_URI=mongodb://...
JWT_SECRET=...
JWT_EXPIRE=7d
FRONTEND_URL=https://...
TRUST_PROXY=true
```

### Frontend (environment.prod.ts)
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.your-domain.com/api'
};
```

## 🛠️ Maintenance

### Regular Tasks
- Update dependencies: `npm audit fix`
- Database backups
- Log rotation
- Monitor server resources
- Security updates

### Backup Strategy
```bash
# MongoDB backup
mongodump --uri="mongodb://..." --out=/backup/$(date +%Y%m%d)

# Restore
mongorestore --uri="mongodb://..." /backup/20240123
```

## 📞 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check MongoDB is running
   - Verify connection string
   - Check firewall rules

2. **CORS Errors**
   - Verify FRONTEND_URL in .env
   - Check CORS configuration

3. **Rate Limiting Too Strict**
   - Adjust rate limit settings in `rateLimiter.js`

4. **Memory Issues**
   - Use PM2 with memory limits
   - Enable clustering

## ✅ Production Checklist

- [ ] All environment variables set
- [ ] JWT secret changed to strong random value
- [ ] MongoDB with authentication
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] PM2 or process manager set up
- [ ] Database backups scheduled
- [ ] Monitoring set up
- [ ] Security headers configured
- [ ] Frontend production build tested
- [ ] API endpoints tested
- [ ] Load testing completed

## 🎯 Post-Deployment

1. Test all critical flows
2. Monitor error logs
3. Check performance metrics
4. Set up alerts
5. Document deployment process
