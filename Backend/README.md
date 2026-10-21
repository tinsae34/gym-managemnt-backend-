# 🏋️‍♂️ Gym Management API

A robust, type-safe RESTful API for managing gym memberships, cash/digital payments, automated QR code check-ins, and SMS notifications built with **Node.js**, **TypeScript**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

## 🎯 Phases

- **Phase 1**: Core API (Members, Payments, Check-ins) ✅
- **Phase 2**: Automated SMS Notifications & Cron Jobs ✅

---

## 🛠 Tech Stack

- **Runtime & Language**: Node.js & TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
- **SMS Service**: AfroMessage API
- **Scheduled Jobs**: node-cron
- **HTTP Client**: axios
- **Utilities**: `dotenv`, `cors`, `ts-node-dev`, `uuid`

---

## 📂 Project Structure

```text
.
├── prisma/
│   └── schema.prisma           # Prisma Data Models & Enums
├── src/
│   ├── config/
│   │   └── db.ts               # PrismaClient Singleton Instance
│   ├── controllers/
│   │   ├── member.controller.ts   # Member registration, listing, search
│   │   ├── payment.controller.ts  # Transactional payment & extension
│   │   └── checkin.controller.ts  # QR code validation & check-in
│   ├── middlewares/
│   │   └── errorHandler.ts     # Universal Prisma & App error handler
│   ├── routes/
│   │   ├── index.ts            # Central route aggregator
│   │   ├── member.routes.ts    # /api/members endpoints
│   │   ├── payment.routes.ts   # /api/payments endpoints
│   │   └── checkin.routes.ts   # /api/checkin endpoints
│   ├── utils/
│   │   ├── appError.ts         # Custom operational error class
│   │   └── response.ts         # Standard API response format helper
│   └── index.ts                # Express server entrypoint
├── .env.example                # Environment variables template
├── package.json
└── tsconfig.json
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and set your PostgreSQL credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/gym_management_db?schema=public"
```

### 3. Run Prisma Migrations & Generate Client
```bash
# Push schema migrations to PostgreSQL
npx prisma migrate dev --name init

# Generate Prisma Client types
npx prisma generate
```

### 4. Start Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5000`.

---

## 📡 API Endpoints Reference

All responses follow the standard response envelope:
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

---

### 1. Register Member
**`POST /api/members`**

Creates a new member, generates a unique UUID `qrCodeToken`, sets `startDate` to now, sets `expiryDate` to `now + 30 days`, and sets `status` to `ACTIVE`.

- **Body:**
```json
{
  "fullName": "Jane Doe",
  "phoneNumber": "+1234567890"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "id": "b3e0c46b-648b-40f4-8a47-f58c704f5e71",
    "fullName": "Jane Doe",
    "phoneNumber": "+1234567890",
    "status": "ACTIVE",
    "startDate": "2026-10-02T15:50:00.000Z",
    "expiryDate": "2026-11-01T15:50:00.000Z",
    "qrCodeToken": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "createdAt": "2026-10-02T15:50:00.000Z",
    "updatedAt": "2026-10-02T15:50:00.000Z"
  },
  "message": "Member registered successfully."
}
```

---

### 2. List Members
**`GET /api/members`**
**`GET /api/members?status=ACTIVE`**

Retrieves all members with optional status filter (`ACTIVE`, `EXPIRED`, `FROZEN`).

- **Query Parameters**:
  - `status` (optional): Filter by `MembershipStatus`

---

### 3. Search Member
**`GET /api/members/search`**

Finds a member by `phoneNumber` or `qrCodeToken`.

- **Query Parameters**:
  - `phoneNumber` or `qrCodeToken` or `query`
  - Example: `GET /api/members/search?phoneNumber=+1234567890`
  - Example: `GET /api/members/search?qrCodeToken=6ba7b810-9dad-11d1-80b4-00c04fd430c8`

---

### 4. Record Payment & Extend Membership
**`POST /api/payments`**

Processes a payment within a Prisma transaction (`$transaction`):
1. Creates a `Payment` record.
2. Extends the member's `expiryDate` by 30 days (adding to existing expiry if active, or from today if expired).
3. Sets member `status` to `ACTIVE`.

- **Body:**
```json
{
  "memberId": "b3e0c46b-648b-40f4-8a47-f58c704f5e71",
  "amount": 49.99,
  "paymentMethod": "CASH",
  "transactionRef": "RCPT-10023"
}
```

- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "payment": {
      "id": "e4f8d9b1-5231-419b-a734-d0295191b293",
      "memberId": "b3e0c46b-648b-40f4-8a47-f58c704f5e71",
      "amount": "49.99",
      "paymentMethod": "CASH",
      "transactionRef": "RCPT-10023",
      "createdAt": "2026-10-02T15:52:00.000Z"
    },
    "member": {
      "id": "b3e0c46b-648b-40f4-8a47-f58c704f5e71",
      "fullName": "Jane Doe",
      "status": "ACTIVE",
      "expiryDate": "2026-12-01T15:50:00.000Z"
    }
  },
  "message": "Payment processed successfully and membership extended by 30 days."
}
```

---

### 5. Check-In with QR Code Token
**`POST /api/checkin`**

Validates member's QR token and active status:
- If membership is active and `expiryDate > now`, records check-in and returns `200 OK`.
- If membership is expired or frozen, returns `400 Bad Request` with `"Membership expired"`.

- **Body:**
```json
{
  "qrCodeToken": "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
}
```

- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "checkIn": {
      "id": "a1f7d2b8-9311-48cf-990a-f923485ab112",
      "memberId": "b3e0c46b-648b-40f4-8a47-f58c704f5e71",
      "createdAt": "2026-10-02T15:53:00.000Z"
    },
    "member": {
      "id": "b3e0c46b-648b-40f4-8a47-f58c704f5e71",
      "fullName": "Jane Doe",
      "status": "ACTIVE",
      "expiryDate": "2026-12-01T15:50:00.000Z"
    }
  },
  "message": "Check-in successful. Welcome to the gym!"
}
```


---

## 🤖 Phase 2: Automated SMS Notifications

Phase 2 adds automated membership management with scheduled cron jobs and SMS notifications.

### Features

1. **Daily Cron Jobs** - Scheduled membership checks
2. **3-Day Expiry Warning** - SMS notifications 3 days before expiration
3. **Same-Day Expiry Warning** - SMS notifications on expiration day
4. **Automatic Status Updates** - Expired members automatically updated
5. **AfroMessage Integration** - Transactional SMS via API

### Quick Start Phase 2

```bash
# Install new dependencies
npm install

# Configure SMS in .env
AFROMESSAGE_API_TOKEN=your_token_here
CRON_SCHEDULE="0 9 * * *"
ENABLE_CRON_JOBS=true

# Start server (cron initializes automatically)
npm run dev
```

### Testing Phase 2

```bash
# Run comprehensive tests
npm run test:phase2

# Test cron job manually
npm run run:cron

# Test membership queries
npm run test:cron
```

### Documentation

- **[Phase 2 README](./PHASE2_README.md)** - Complete feature documentation
- **[Installation Guide](./INSTALLATION_PHASE2.md)** - Step-by-step setup
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment

### Console Output Example

```
⏰ Initializing membership cron job...
   Schedule: 0 9 * * * (Daily at 9:00 AM)
   SMS Service: Enabled ✅
✅ Membership cron job initialized successfully

🔄 Starting daily membership check tasks
📅 Running 3-day expiry warning task...
   Found 5 members expiring in 3 days
   ✅ Sent 5 warnings, 0 failed
```

---

## 📜 Available Scripts

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build TypeScript to dist/
npm start                # Start production server

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run migrations
npm run prisma:studio    # Open Prisma Studio

# Testing & Phase 2
npm run test:cron        # Test cron job functionality
npm run run:cron         # Manually run cron tasks
npm run test:phase2      # Comprehensive Phase 2 tests
```

---

## 🔧 Environment Variables

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL="postgresql://user:pass@host:5432/db?schema=public"

# SMS Service (Phase 2)
AFROMESSAGE_API_TOKEN=your_api_token
AFROMESSAGE_SENDER_ID=GYM_MGMT

# Cron Jobs (Phase 2)
CRON_SCHEDULE="0 9 * * *"
ENABLE_CRON_JOBS=true
```

---

## 📊 System Architecture

```
┌─────────────────────────────────────────┐
│         Frontend (React/Vite)           │
│  - Check-in Screen                      │
│  - Member Management                    │
│  - Payment Processing                   │
└──────────────┬──────────────────────────┘
               │ HTTP/REST API
┌──────────────┴──────────────────────────┐
│      Backend (Node.js/Express)          │
│  ┌──────────────────────────────────┐   │
│  │  API Routes & Controllers        │   │
│  └───────────┬──────────────────────┘   │
│  ┌───────────┴──────────────────────┐   │
│  │  Services & Business Logic       │   │
│  │  - SMS Service (AfroMessage)     │   │
│  │  - Membership Management         │   │
│  └───────────┬──────────────────────┘   │
│  ┌───────────┴──────────────────────┐   │
│  │  Cron Jobs (node-cron)           │   │
│  │  - 3-Day Expiry Warnings         │   │
│  │  - Same-Day Warnings             │   │
│  │  - Status Updates                │   │
│  └──────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │ Prisma ORM
┌──────────────┴──────────────────────────┐
│      PostgreSQL Database                │
│  - Members                              │
│  - Payments                             │
│  - Check-ins                            │
└─────────────────────────────────────────┘
```

---

## 🚀 Production Deployment

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for complete production deployment guide including:

- Cloud platform deployment (Heroku, Railway, AWS)
- VPS setup with PM2 and Nginx
- SSL configuration
- Monitoring and logging
- Security hardening
- Backup strategies

---

## 🔒 Security Best Practices

- ✅ Environment variables for sensitive data
- ✅ Input validation on all endpoints
- ✅ Prisma parameterized queries (SQL injection protection)
- ✅ Error handling without exposing internals
- ✅ CORS configuration
- ✅ Rate limiting recommended for production
- ✅ Database connection pooling

---

## 📖 Additional Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [Express.js Guide](https://expressjs.com/)
- [node-cron Documentation](https://www.npmjs.com/package/node-cron)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [AfroMessage API](https://www.afromessage.com)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Private - Gym Management System

---

## 📞 Support

For issues and questions:
- Backend API: Review logs and error messages
- SMS Integration: Contact AfroMessage support
- Database: Check Prisma documentation
- Deployment: See DEPLOYMENT.md

---

**Built with ❤️ for efficient gym management**
