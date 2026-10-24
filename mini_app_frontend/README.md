# 🏋️‍♂️ Gym Telegram Mini App - Phase 3

A modern Telegram Mini App for gym members to manage their memberships, view digital access QR codes, renew subscriptions, and access fitness guides—all within Telegram.

---

## 🚀 Features

### 1. **Telegram Auto-Authentication**
- Seamlessly extracts user data from Telegram Web App API
- Auto-registers members using Telegram ID and phone number
- No separate login required

### 2. **Digital Membership Pass**
- **Dynamic QR Code**: Scan at gym reception for instant check-in
- **Real-time Status**: Shows active/expired status with countdown
- **Expiry Warnings**: Visual alerts when membership is about to expire

### 3. **In-App Membership Renewal**
- Choose from flexible plans (1, 3, or 6 months)
- Integrated with digital payment gateways (Chapa/Telebirr)
- Instant membership extension after successful payment

### 4. **Live Gym Density Tracker**
- Real-time gym capacity monitoring
- Color-coded status (Quiet, Moderate, Busy, Crowded)
- Helps members plan optimal workout times

### 5. **High-Protein Nutrition Guide**
- Ethiopian local foods with protein content
- Eggs, Tilapia, Ayib (cottage cheese), Misir (lentils), Peanut butter
- Daily serving recommendations

### 6. **5-Day Workout Split**
- Structured workout program
- Upper, Lower, Rest, Push, Pull & Legs
- Exercise recommendations for each day

---

## 🛠 Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Telegram SDK**: Native Telegram Web App API
- **QR Generation**: `qrcode.react`
- **Icons**: `lucide-react`
- **HTTP Client**: Axios
- **Deployment**: Can be hosted on Netlify, Vercel, or GitHub Pages

---

## 📂 Project Structure

```
mini_app_frontend/
├── src/
│   ├── components/
│   │   ├── GymDensityCard.tsx      # Live gym capacity display
│   │   ├── LoadingScreen.tsx       # App loading state
│   │   ├── QRDisplay.tsx           # QR code component
│   │   ├── RenewalModal.tsx        # Membership renewal flow
│   │   └── StatusBadge.tsx         # Membership status indicator
│   ├── lib/
│   │   ├── api.ts                  # Backend API integration
│   │   └── telegram.ts             # Telegram Web App utilities
│   ├── pages/
│   │   ├── GuideScreen.tsx         # Nutrition & workout guide
│   │   ├── HomeScreen.tsx          # Main membership dashboard
│   │   └── OnboardingScreen.tsx    # First-time user registration
│   ├── types/
│   │   └── index.ts                # TypeScript interfaces
│   ├── utils/
│   │   └── dateUtils.ts            # Date formatting & calculations
│   ├── App.tsx                     # Main app component
│   ├── index.css                   # Global styles
│   └── main.tsx                    # App entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Backend API running (see `Backend/README.md`)
- Telegram Bot created via [@BotFather](https://t.me/botfather)

### Installation

```bash
# Navigate to mini app directory
cd mini_app_frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Configuration

Edit `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_CHAPA_PUBLIC_KEY=your_chapa_public_key_here
```

### Development

```bash
# Start development server
npm run dev
```

The app will run at `http://localhost:3001`

### Testing in Telegram

1. **Create a Telegram Bot:**
   - Open [@BotFather](https://t.me/botfather) in Telegram
   - Send `/newbot` and follow instructions
   - Save your bot token

2. **Set Mini App URL:**
   - Send `/newapp` to BotFather
   - Select your bot
   - Provide app details and URL: `https://your-domain.com`

3. **For Local Testing:**
   - Use [ngrok](https://ngrok.com/) to expose localhost:
     ```bash
     ngrok http 3001
     ```
   - Use the ngrok HTTPS URL as your Mini App URL

4. **Open the Mini App:**
   - Go to your bot in Telegram
   - Tap the keyboard button or menu icon
   - Launch the Mini App

---

## 🎨 Design Principles

### Dark Theme
- Matches Telegram's native dark mode
- Background: `#0f172a` (slate-900)
- Primary accent: `#001B74` (blue-900)
- Uses Telegram theme CSS variables for seamless integration

### Mobile-First UX
- Touch-optimized buttons and interactions
- Haptic feedback for all user actions
- Smooth transitions and animations
- Thumb-friendly navigation at bottom

### Telegram Integration
- Uses native Telegram UI components
- Haptic feedback for tactile responses
- Native alerts and confirmations
- Smooth back button handling

---

## 📱 Features Walkthrough

### First Launch (Onboarding)
1. App detects new user via Telegram ID
2. Prompts for phone number
3. Registers member with backend
4. Redirects to home screen

### Home Screen
- Displays membership status badge
- Shows days remaining until expiry
- Renders dynamic QR code for scanning
- Live gym density indicator
- Quick membership info card

### Renewal Flow
1. Tap "Renew Membership" button
2. Select plan (1/3/6 months)
3. Review payment summary
4. Redirect to Chapa payment gateway
5. Auto-refresh status after payment

### Guide Screen
- High-protein local Ethiopian foods
- 5-day workout split recommendations
- Hydration tracking reminder

---

## 🔗 API Integration

The app connects to the backend API for:

- **Member Search**: `GET /api/members/search?telegramId=123`
- **Member Registration**: `POST /api/members`
- **Payment Processing**: `POST /api/payments`
- **Member Data Refresh**: `GET /api/members/:id`

All API calls are handled through `src/lib/api.ts`

---

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

This generates optimized static files in the `dist/` folder.

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Deploy to GitHub Pages

```bash
# Build the project
npm run build

# Deploy to gh-pages branch
npx gh-pages -d dist
```

Then set the Mini App URL in BotFather to your deployed URL.

---

## 🔒 Security Considerations

1. **Telegram Data Validation**: Always validate `initData` on backend
2. **Payment Verification**: Implement webhook verification for Chapa
3. **HTTPS Only**: Mini Apps require secure connections
4. **API Rate Limiting**: Implement rate limits on backend
5. **Environment Variables**: Never commit `.env` files

---

## 📊 Future Enhancements

- [ ] Push notifications for membership expiry
- [ ] Workout tracking and progress logs
- [ ] Personal trainer booking
- [ ] Friend referral system
- [ ] Integration with fitness wearables
- [ ] Multi-language support (Amharic, Oromiffa)
- [ ] In-app chat with gym staff

---

## 🐛 Troubleshooting

### Issue: Telegram user data not available

**Solution**: Make sure you're testing inside Telegram. The Web App API only works within Telegram.

### Issue: API requests failing

**Solution**: 
1. Verify backend is running on port 5000
2. Check `VITE_API_BASE_URL` in `.env`
3. Ensure CORS is enabled on backend

### Issue: QR Code not displaying

**Solution**: Check that member has a valid `qrCodeToken` in the database.

### Issue: Payment not completing

**Solution**: Verify Chapa API keys are correct and webhook URL is configured.

---

## 📞 Support

For issues or questions:
- Backend API: See `Backend/README.md`
- Telegram Bot Setup: [@BotFather](https://t.me/botfather)
- Chapa Integration: [Chapa Docs](https://developer.chapa.co/)

---

## ✅ Checklist Before Launch

- [ ] Backend API deployed and accessible
- [ ] Database migrations completed
- [ ] Telegram bot created via BotFather
- [ ] Mini App URL configured in BotFather
- [ ] Chapa payment gateway configured
- [ ] Environment variables set correctly
- [ ] SSL certificate active (HTTPS required)
- [ ] Test all user flows (onboarding, renewal, QR display)
- [ ] Haptic feedback tested on real device
- [ ] Error handling tested

---

**Phase 3 Complete!** 🎉

Your gym members can now manage their memberships entirely within Telegram.
