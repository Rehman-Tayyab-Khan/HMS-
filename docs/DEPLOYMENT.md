# Deployment & Setup Guide

Complete guide for setting up and deploying the Hospital Management System.

## 🚀 Quick Start (Development)

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher) - Make sure MongoDB is running
- npm or yarn

### 1. Backend Setup

```bash
cd Backend
npm install
```

Create `.env` file (copy from `.env.example`):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/hms
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

Start the backend:
```bash
npm start          # Production
npm run dev        # Development (with auto-reload)
```

Backend runs on `http://localhost:3000`

### 2. Frontend Setup

```bash
cd Frontend/HMS
npm install
npm start
```

Frontend runs on `http://localhost:4200`

### 3. Access Application

- Frontend: http://localhost:4200
- Backend API: http://localhost:3000/api
- Health Check: http://localhost:3000/api/health
- API Docs: http://localhost:3000/api-docs (development)

## 📦 Production Deployment

### Pre-Deployment Checklist

#### Environment Variables
- [ ] Create `.env` file with production values
- [ ] Set strong JWT_SECRET (min 32 characters)
- [ ] Configure MONGODB_URI with authentication
- [ ] Set FRONTEND_URL for CORS
- [ ] Set NODE_ENV=production

#### Security
- [ ] Change default JWT_SECRET
- [ ] Enable MongoDB authentication
- [ ] Configure CORS for production domain only
- [ ] Set up HTTPS/SSL certificates
- [ ] Review rate limit settings
- [ ] Run `npm audit fix`

#### Database
- [ ] Set up MongoDB with authentication
- [ ] Configure database backups
- [ ] Test database connection
- [ ] Create indexes if needed

#### Frontend
- [ ] Update `environment.prod.ts` with production API URL
- [ ] Build production bundle: `npm run build:prod`
- [ ] Test production build locally
- [ ] Verify all API endpoints work

### Backend Production Setup

#### 1. Install Production Dependencies

```bash
cd Backend
npm install --production
```

#### 2. Environment Configuration

Create `.env` file:
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

#### 3. Start with PM2 (Recommended)

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

PM2 Configuration (`ecosystem.config.js`):
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
    max_memory_restart: '1G',
    watch: false,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
```

### Frontend Production Setup

#### 1. Build for Production

```bash
cd Frontend/HMS
npm install
npm run build:prod
```

This creates optimized production build in `dist/hms/browser/` directory.

#### 2. Update Production Environment

Edit `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://your-api-domain.com/api'
};
```

#### 3. Serve with Nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/Frontend/HMS/dist/hms/browser;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;

    # Angular app
    location / {
        try_files $uri $uri/ /index.html;
        expires -1;
        add_header Cache-Control "no-store, no-cache, must-revalidate";
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Docker Deployment

#### Using Docker Compose

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 🔒 Security Best Practices

### Environment Variables
- Never commit `.env` files
- Use different secrets for development and production
- Rotate JWT secrets periodically

### Database Security
- Use MongoDB authentication
- Enable SSL/TLS for database connections
- Regular backups
- Use connection pooling

### API Security
- Rate limiting enabled ✅
- Input validation ✅
- XSS protection ✅
- NoSQL injection protection ✅
- CORS properly configured ✅

### Server Security
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

# Using npm scripts
npm run backup              # Standard backup
npm run backup:compress     # Compressed backup
npm run restore <path>      # Restore from backup
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Make sure MongoDB is running
- Check if MongoDB is listening on port 27017
- Verify the MONGODB_URI in your .env file

### Port Already in Use
- Backend: Change PORT in .env file
- Frontend: Use `ng serve --port 4201` or another port

### CORS Errors
- Make sure backend is running before frontend
- Check that backend CORS is enabled
- Verify FRONTEND_URL in backend .env

### Rate Limiting Too Strict
- Adjust rate limit settings in `Backend/middleware/rateLimiter.js`

### Memory Issues
- Use PM2 with memory limits
- Enable clustering

## ✅ Post-Deployment Checklist

- [ ] Test all critical flows
- [ ] Monitor error logs
- [ ] Check health endpoint
- [ ] Monitor server resources
- [ ] Set up alerts
- [ ] Document deployment process
- [ ] Schedule regular backups
- [ ] Update dependencies monthly
- [ ] Review security advisories
- [ ] Monitor performance metrics
- [ ] Rotate secrets quarterly

## 📝 First Time Setup

After starting both servers, you'll need to create your first user account:

1. Using the registration API endpoint (requires admin privileges)
2. Or creating directly in MongoDB (see main README.md)

The application is now running! 🎉
