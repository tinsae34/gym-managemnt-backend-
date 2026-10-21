# Phase 2 Installation Guide

## 🚀 Quick Start

Follow these steps to install and configure Phase 2 automated membership management.

### Step 1: Install Dependencies

```bash
cd Backend
npm install
```

This will install:
- `node-cron` - Cron job scheduler
- `axios` - HTTP client for AfroMessage API
- `@types/node-cron` - TypeScript definitions

### Step 2: Configure Environment Variables

Edit your `Backend/.env` file and add:

```env
# AfroMessage SMS API Configuration
AFROMESSAGE_API_TOKEN=your_actual_token_here
AFROMESSAGE_SENDER_ID=GYM_MGMT

# Cron Job Configuration
CRON_SCHEDULE="0 9 * * *"
ENABLE_CRON_JOBS=true
```

**How to get AfroMessage API Token:**
1. Visit [AfroMessage](https://www.afromessage.com)
2. Sign up / Log in to your account
3. Navigate to API Settings
4. Generate or copy your API token
5. Paste it in the `.env` file

### Step 3: Start the Server

```bash
# Development mode (auto-reloads on changes)
npm run dev

# Production mode
npm run build
npm start
```

### Step 4: Verify Installation

Check the console output for:

```
⏰ Initializing membership cron job...
   Schedule: 0 9 * * * (Daily at 9:00 AM)
   SMS Service: Enabled ✅
✅ Membership cron job initialized successfully
```

If you see `SMS Service: Disabled ⚠️`, check your API token configuration.

## 🧪 Testing Phase 2

### Test 1: Verify SMS Service

Create test data and run queries:

```bash
npx ts-node src/test/membership-cron.test.ts
```

This will:
- Create test members with various expiry dates
- Run database queries to find expiring members
- Test SMS sending (if enabled)

### Test 2: Test SMS Manually

Create a simple test file:

```typescript
// test-sms.ts
import { smsService } from './src/services/sms.service';

async function test() {
  await smsService.sendSMS({
    to: '+251912345678', // Your test phone number
    message: 'Test from Gym Management System'
  });
}

test();
```

Run it:
```bash
npx ts-node test-sms.ts
```

### Test 3: Run Cron Job Immediately

Set `NODE_ENV=development` in your `.env` file. The cron job will execute immediately on server startup.

Or use a frequent schedule for testing:
```env
CRON_SCHEDULE="*/2 * * * *"  # Every 2 minutes
```

## 📋 Cron Schedule Configuration

### Common Schedules

| Schedule | Description | Use Case |
|----------|-------------|----------|
| `0 9 * * *` | Daily at 9:00 AM | **Recommended** for production |
| `0 0 * * *` | Daily at midnight | Late night processing |
| `0 */6 * * *` | Every 6 hours | More frequent checks |
| `*/5 * * * *` | Every 5 minutes | Testing only |
| `0 9 * * 1-5` | Weekdays at 9 AM | Business days only |

### Cron Syntax

```
* * * * *
│ │ │ │ │
│ │ │ │ └─── Day of week (0-7, 0 and 7 are Sunday)
│ │ │ └───── Month (1-12)
│ │ └─────── Day of month (1-31)
│ └───────── Hour (0-23)
└─────────── Minute (0-59)
```

Use [Crontab Guru](https://crontab.guru/) to test your schedule.

## 🔧 Configuration Options

### Enable/Disable Cron Jobs

```env
# Enable cron jobs (default)
ENABLE_CRON_JOBS=true

# Disable cron jobs (for testing or maintenance)
ENABLE_CRON_JOBS=false
```

### SMS Service Configuration

```env
# Your AfroMessage API token (required)
AFROMESSAGE_API_TOKEN=your_token_here

# Sender ID shown on SMS (optional, default: GYM_MGMT)
AFROMESSAGE_SENDER_ID=MyGym

# For testing without real SMS (leave token empty)
# AFROMESSAGE_API_TOKEN=
```

### Node Environment

```env
# Development mode - runs cron immediately on startup
NODE_ENV=development

# Production mode - waits for scheduled time
NODE_ENV=production
```

## 📊 Monitoring

### Console Logs

The system provides detailed logging:

```
🔄 ========================================
🔄 Starting daily membership check tasks
🔄 Timestamp: 2024-01-15T09:00:00.000Z
🔄 ========================================

📅 Running 3-day expiry warning task...
   Found 5 members expiring in 3 days
✅ SMS sent successfully to +251912345678
✅ SMS sent successfully to +251923456789
   ✅ Sent 5 warnings, 0 failed

📅 Running same-day expiry warning task...
   Found 2 members expiring today
   ✅ Sent 2 warnings, 0 failed

📅 Running overdue membership expiration task...
   Found 3 overdue members
   ✅ Updated 3 members to EXPIRED status
   ✅ Sent 3 expiry alerts, 0 failed

✅ ========================================
✅ Daily membership tasks completed
✅ ========================================
```

### Database Verification

Check member status updates:

```sql
-- See all members and their status
SELECT "fullName", status, "expiryDate" 
FROM members 
ORDER BY "expiryDate";

-- Count members by status
SELECT status, COUNT(*) 
FROM members 
GROUP BY status;

-- Find members expiring soon
SELECT "fullName", "phoneNumber", "expiryDate"
FROM members
WHERE status = 'ACTIVE' 
  AND "expiryDate" BETWEEN NOW() AND NOW() + INTERVAL '7 days';
```

## 🐛 Troubleshooting

### Issue: SMS Not Sending

**Symptoms:**
- Console shows `SMS Service: Disabled ⚠️`
- Messages show `[SMS DISABLED] Would send to...`

**Solution:**
1. Check `.env` file has `AFROMESSAGE_API_TOKEN` set
2. Verify token is valid (no quotes, no spaces)
3. Restart the server after updating `.env`

### Issue: Cron Job Not Running

**Symptoms:**
- No cron initialization logs on startup
- Scheduled tasks not executing

**Solution:**
1. Check `ENABLE_CRON_JOBS=true` in `.env`
2. Verify cron schedule is valid
3. Check for syntax errors in cron schedule
4. Review server startup logs for errors

### Issue: No Members Found

**Symptoms:**
- Cron runs but finds 0 members in all tasks

**Solution:**
1. Verify database has member data:
   ```sql
   SELECT COUNT(*) FROM members WHERE status = 'ACTIVE';
   ```
2. Check member expiry dates are in correct range
3. Verify database connection in `.env`
4. Run test script to create sample data

### Issue: Wrong Timezone

**Symptoms:**
- Cron runs at wrong time

**Solution:**
1. Update timezone in `src/jobs/membershipCron.ts`:
   ```typescript
   cron.schedule(cronSchedule, runMembershipTasks, {
     timezone: 'Africa/Addis_Ababa', // Change this
     scheduled: true,
   });
   ```
2. Common timezones:
   - `Africa/Addis_Ababa` (Ethiopia)
   - `Africa/Nairobi` (Kenya)
   - `UTC`
   - `America/New_York`

## 🔒 Security Best Practices

1. **Never commit `.env` files** with real credentials
2. **Use environment variables** in production (not .env files)
3. **Rotate API tokens** regularly
4. **Monitor API usage** to detect anomalies
5. **Implement rate limiting** if sending high volume SMS

## 📈 Production Deployment

### Using PM2 (Process Manager)

```bash
# Install PM2 globally
npm install -g pm2

# Start the application
pm2 start dist/index.js --name gym-api

# Enable auto-restart on server reboot
pm2 startup
pm2 save

# Monitor logs
pm2 logs gym-api

# Monitor status
pm2 status
```

### Using Docker

```dockerfile
# Dockerfile (example)
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

CMD ["node", "dist/index.js"]
```

### Environment Variables in Production

```bash
# Set via cloud provider (e.g., AWS, Heroku, etc.)
export AFROMESSAGE_API_TOKEN="your_token"
export CRON_SCHEDULE="0 9 * * *"
export ENABLE_CRON_JOBS="true"
export DATABASE_URL="postgresql://..."
```

## 📞 Support

For issues specific to:
- **AfroMessage API**: Contact AfroMessage support
- **Cron Jobs**: Review `node-cron` documentation
- **Database**: Check Prisma documentation
- **Application**: Review logs and console output

## ✅ Verification Checklist

- [ ] Dependencies installed (`npm install` successful)
- [ ] Environment variables configured in `.env`
- [ ] AfroMessage API token is valid
- [ ] Server starts without errors
- [ ] Cron job initialization message appears
- [ ] SMS service status shows "Enabled ✅"
- [ ] Test SMS sends successfully (optional)
- [ ] Database connection is working
- [ ] Timezone is configured correctly
- [ ] Production deployment plan in place

---

**Phase 2 Installation Complete!** 🎉

Your gym management system now automatically monitors memberships and sends SMS notifications to members.
