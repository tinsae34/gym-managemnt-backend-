# 🚀 Deployment Guide - Gym Management API

Complete guide for deploying the Gym Management API to production.

---

## 📋 Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database migrations run successfully
- [ ] AfroMessage API token obtained and tested
- [ ] SMS templates reviewed and approved
- [ ] Cron schedule configured appropriately
- [ ] Server timezone verified
- [ ] Backup strategy in place
- [ ] Monitoring tools configured
- [ ] SSL certificates ready (if self-hosting)
- [ ] Domain/subdomain configured

---

## 🌐 Deployment Options

### Option 1: Cloud Platforms (Recommended)

#### 1.1 Heroku

```bash
# Install Heroku CLI
npm install -g heroku

# Login to Heroku
heroku login

# Create new app
heroku create gym-management-api

# Add PostgreSQL addon
heroku addons:create heroku-postgresql:hobby-dev

# Set environment variables
heroku config:set AFROMESSAGE_API_TOKEN=your_token
heroku config:set CRON_SCHEDULE="0 9 * * *"
heroku config:set ENABLE_CRON_JOBS=true
heroku config:set NODE_ENV=production

# Deploy
git push heroku main

# Run migrations
heroku run npx prisma migrate deploy

# View logs
heroku logs --tail
```

#### 1.2 Railway

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Add PostgreSQL
railway add --service postgres

# Link environment
railway link

# Deploy
railway up

# Set environment variables in Railway dashboard
# Run migrations
railway run npx prisma migrate deploy
```

#### 1.3 AWS (Elastic Beanstalk + RDS)

1. **Create RDS PostgreSQL Instance**
   - Go to AWS RDS Console
   - Create PostgreSQL database
   - Note connection details

2. **Create Elastic Beanstalk Application**
   ```bash
   # Install EB CLI
   pip install awsebcli
   
   # Initialize EB
   eb init -p node.js gym-management-api
   
   # Create environment
   eb create gym-api-prod
   
   # Set environment variables
   eb setenv DATABASE_URL="postgresql://..." \
             AFROMESSAGE_API_TOKEN="..." \
             CRON_SCHEDULE="0 9 * * *" \
             ENABLE_CRON_JOBS=true \
             NODE_ENV=production
   
   # Deploy
   eb deploy
   
   # View logs
   eb logs
   ```

3. **Run Migrations**
   ```bash
   eb ssh
   cd /var/app/current
   npx prisma migrate deploy
   ```

---

### Option 2: VPS (Self-Hosted)

#### 2.1 Ubuntu Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install PM2 (Process Manager)
sudo npm install -g pm2

# Install Nginx (Reverse Proxy)
sudo apt install nginx -y
```

#### 2.2 Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

# Create database and user
CREATE DATABASE gym_management_db;
CREATE USER gym_admin WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE gym_management_db TO gym_admin;
\q
```

#### 2.3 Application Deployment

```bash
# Clone repository
git clone https://github.com/your-repo/gym-management-api.git
cd gym-management-api/Backend

# Install dependencies
npm ci --only=production

# Create .env file
nano .env
# (Add all environment variables)

# Build TypeScript
npm run build

# Run migrations
npx prisma migrate deploy

# Start with PM2
pm2 start dist/index.js --name gym-api

# Enable auto-start on reboot
pm2 startup
pm2 save

# Monitor
pm2 status
pm2 logs gym-api
```

#### 2.4 Nginx Configuration

```nginx
# /etc/nginx/sites-available/gym-api
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/gym-api /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Install SSL with Let's Encrypt
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.yourdomain.com
```

---

## 🔐 Environment Variables (Production)

### Required Variables

```env
# Server
PORT=5000
NODE_ENV=production

# Database (use connection pooling in production)
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public&connection_limit=10&pool_timeout=20"

# SMS Service
AFROMESSAGE_API_TOKEN=your_production_token
AFROMESSAGE_SENDER_ID=GYM_MGMT

# Cron Jobs
CRON_SCHEDULE="0 9 * * *"
ENABLE_CRON_JOBS=true

# Optional: Logging
LOG_LEVEL=info
```

### Security Best Practices

1. **Never commit `.env` files** to version control
2. **Use secrets management** (AWS Secrets Manager, HashiCorp Vault)
3. **Rotate API tokens** regularly
4. **Use strong database passwords**
5. **Enable database SSL** in production
6. **Implement rate limiting** for API endpoints

---

## 📊 Monitoring & Logging

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# View logs
pm2 logs gym-api

# Flush logs
pm2 flush

# Install PM2 web dashboard
pm2 install pm2-logrotate
```

### Application Logging

Add logging library (Winston):

```bash
npm install winston
```

```typescript
// src/config/logger.ts
import winston from 'winston';

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}
```

### Health Checks

```bash
# Check API health
curl https://api.yourdomain.com/health

# Monitor with Uptime Robot or Pingdom
# Set up alerts for downtime
```

---

## 🔄 Database Migrations

### Production Migration Strategy

```bash
# Backup database before migration
pg_dump -U gym_admin gym_management_db > backup_$(date +%Y%m%d).sql

# Run migrations
npx prisma migrate deploy

# Verify migration
npx prisma db pull
```

### Rollback Strategy

```bash
# Restore from backup
psql -U gym_admin gym_management_db < backup_20240115.sql

# Revert code to previous version
git checkout previous-tag
npm run build
pm2 restart gym-api
```

---

## 🔧 Performance Optimization

### Database Connection Pooling

```env
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20"
```

### Enable Database Indexes

Already included in Prisma schema:
```prisma
@@index([phoneNumber])
@@index([qrCodeToken])
@@index([status])
```

### Caching (Optional)

Install Redis for caching:

```bash
sudo apt install redis-server
npm install redis
```

### Load Balancing (High Traffic)

Use Nginx for load balancing across multiple instances:

```nginx
upstream gym_api {
    least_conn;
    server 127.0.0.1:5000;
    server 127.0.0.1:5001;
    server 127.0.0.1:5002;
}
```

---

## 🛡️ Security Hardening

### 1. Firewall Configuration

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

### 2. Database Security

```bash
# Edit PostgreSQL config
sudo nano /etc/postgresql/14/main/pg_hba.conf

# Use md5 authentication
# host    all    all    0.0.0.0/0    md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

### 3. Rate Limiting

Install `express-rate-limit`:

```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## 🚨 Troubleshooting

### Issue: Cron Jobs Not Running

```bash
# Check PM2 logs
pm2 logs gym-api

# Verify environment variables
pm2 env 0

# Check cron schedule
grep "CRON_SCHEDULE" .env
```

### Issue: Database Connection Fails

```bash
# Test database connection
psql -h hostname -U username -d database

# Check PostgreSQL status
sudo systemctl status postgresql

# Review connection logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

### Issue: SMS Not Sending

```bash
# Test API token
curl -H "Authorization: Bearer YOUR_TOKEN" \
     "https://api.afromessage.com/api/send-sms?to=+251912345678&message=test"

# Check service logs
pm2 logs gym-api | grep SMS
```

---

## 📞 Support & Maintenance

### Regular Maintenance Tasks

- **Daily**: Monitor logs and error rates
- **Weekly**: Review database performance
- **Monthly**: Update dependencies (`npm audit`)
- **Quarterly**: Rotate API credentials

### Backup Strategy

```bash
# Automated daily backups
0 2 * * * pg_dump -U gym_admin gym_management_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz

# Retention: Keep 30 days of backups
find /backups -name "db_*.sql.gz" -mtime +30 -delete
```

---

**Deployment Complete! 🎉**

Your Gym Management API is now running in production with automated SMS notifications and membership management.
