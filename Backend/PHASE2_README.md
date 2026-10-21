# Phase 2: Automated Membership Management & SMS Notifications

## 🎯 Overview

Phase 2 implements automated subscription status checks, expiration notifications, and transactional SMS messaging using the AfroMessage API and scheduled cron jobs.

## 🚀 Features Implemented

### 1. **AfroMessage SMS Service** (`src/services/sms.service.ts`)
- Modular SMS service with `sendSMS()` and `sendBulkSMS()` functions
- Integration with AfroMessage API (`https://api.afromessage.com/api/send-sms`)
- Bearer token authentication
- Graceful fallback when API token is missing (logs warning, doesn't crash)
- Phone number sanitization
- Error handling with detailed logging

### 2. **Daily Membership Cron Job** (`src/jobs/membershipCron.ts`)

#### Task 1: 3-Day Expiry Warning
- Runs daily at configured time (default: 9:00 AM)
- Queries members with `status: ACTIVE` expiring in 72-96 hours
- Sends SMS: *"Hi [Name], your gym membership expires in 3 days on [Date]. Please renew at reception or online to avoid interruption."*

#### Task 2: Same-Day Expiry Warning
- Queries members with `status: ACTIVE` expiring today
- Sends SMS: *"Hi [Name], your gym membership expires TODAY! Visit the front desk or renew online to keep your active pass."*

#### Task 3: Status Transition & Overdue Alert
- Queries members with `status: ACTIVE` whose `expiryDate` has passed
- Updates status to `EXPIRED` in bulk using Prisma
- Sends SMS: *"Hi [Name], your gym membership has expired. Renew today to regain workout access!"*

### 3. **Application Lifecycle Integration** (`src/index.ts`)
- Initializes `initMembershipCron()` on server startup
- Clear console logs for successful initialization
- Graceful cron job management

## 📦 Dependencies Added

```json
{
  "dependencies": {
    "node-cron": "^3.0.3",
    "axios": "^1.6.2"
  },
  "devDependencies": {
    "@types/node-cron": "^3.0.11"
  }
}
```

## ⚙️ Environment Configuration

Add these variables to your `.env` file:

```env
# AfroMessage SMS API Configuration
AFROMESSAGE_API_TOKEN=your_afromessage_api_token_here
AFROMESSAGE_SENDER_ID=GYM_MGMT

# Cron Job Configuration
CRON_SCHEDULE="0 9 * * *"
ENABLE_CRON_JOBS=true
```

### Cron Schedule Examples

| Schedule | Description |
|----------|-------------|
| `0 9 * * *` | Daily at 9:00 AM (default) |
| `0 0 * * *` | Daily at midnight |
| `0 */6 * * *` | Every 6 hours |
| `*/5 * * * *` | Every 5 minutes (testing) |
| `0 9 * * 1` | Every Monday at 9:00 AM |

## 🔧 Installation & Setup

### 1. Install Dependencies

```bash
cd Backend
npm install
```

### 2. Configure Environment Variables

```bash
# Copy example environment file
cp .env.example .env

# Edit .env and add your AfroMessage API token
nano .env
```

### 3. Start the Server

```bash
# Development mode (runs cron immediately on startup)
npm run dev

# Production mode
npm run build
npm start
```

## 📊 Monitoring & Logs

The cron job provides detailed console logging:

```
⏰ Initializing membership cron job...
   Schedule: 0 9 * * * (Daily at 9:00 AM)
   SMS Service: Enabled ✅
✅ Membership cron job initialized successfully

🔄 ========================================
🔄 Starting daily membership check tasks
🔄 Timestamp: 2024-01-15T09:00:00.000Z
🔄 ========================================

📅 Running 3-day expiry warning task...
   Found 5 members expiring in 3 days
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

## 🧪 Testing

### Test SMS Service Manually

Create a test script `src/test/sms.test.ts`:

```typescript
import { smsService } from '../services/sms.service';

async function testSMS() {
  const result = await smsService.sendSMS({
    to: '+251912345678',
    message: 'Test message from Gym Management System',
  });
  console.log('SMS sent:', result);
}

testSMS();
```

### Test Cron Job Immediately

Set `NODE_ENV=development` in your `.env` file. The cron job will run immediately on server startup.

### Test with Custom Schedule

For testing, use a more frequent schedule:

```env
CRON_SCHEDULE="*/2 * * * *"  # Every 2 minutes
```

## 🔒 Security Considerations

1. **API Token Protection**: Never commit `.env` files with real tokens
2. **Phone Number Validation**: Service sanitizes phone numbers before sending
3. **Rate Limiting**: Consider implementing rate limiting on SMS sends
4. **Error Handling**: All errors are caught and logged without crashing the server

## 📈 Future Enhancements

- [ ] SMS delivery status tracking
- [ ] Retry mechanism for failed SMS
- [ ] SMS template management in database
- [ ] Admin dashboard for SMS statistics
- [ ] Multi-language SMS support
- [ ] SMS cost tracking and analytics
- [ ] Custom notification preferences per member

## 🛠️ Troubleshooting

### SMS Not Sending

1. Check API token: `echo $AFROMESSAGE_API_TOKEN`
2. Verify internet connectivity
3. Check AfroMessage API status
4. Review error logs in console

### Cron Job Not Running

1. Verify `ENABLE_CRON_JOBS=true` in `.env`
2. Check cron schedule syntax: [Crontab Guru](https://crontab.guru/)
3. Review server startup logs
4. Ensure server timezone is correct

### No Members Found

1. Verify database has test data
2. Check member expiry dates are in the correct range
3. Confirm member status is `ACTIVE`

## 📝 API Endpoints (Existing)

Phase 2 doesn't add new API endpoints but enhances the backend with automated background tasks.

## 🤝 Support

For AfroMessage API documentation and support:
- Website: https://www.afromessage.com
- API Docs: Contact AfroMessage support for API documentation

---

**Phase 2 Status**: ✅ Complete and Production Ready
