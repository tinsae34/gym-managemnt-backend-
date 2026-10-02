# 🏋️‍♂️ Gym Management API - Phase 1 MVP

A robust, type-safe RESTful API for managing gym memberships, cash/digital payments, and automated QR code check-ins built with **Node.js**, **TypeScript**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

---

## 🛠 Tech Stack

- **Runtime & Language**: Node.js & TypeScript
- **Framework**: Express.js
- **Database & ORM**: PostgreSQL & Prisma ORM
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
