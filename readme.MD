# 🩸 LifeDrop — Blood Donation App

A professional, world-class blood donation app built with React Native + Expo.

---

## 📁 File Structure

```
BloodDonationApp/
├── App.js                          # Navigation root
├── package.json
└── src/
    ├── theme.js                    # Design tokens (colors, spacing, typography)
    └── screens/
        ├── LoginScreen.js          # Animated login with hero
        ├── RegisterScreen.js       # 3-step multi-page registration
        ├── HomeScreen.js           # Donor search + urgent requests
        ├── DonorDetailScreen.js    # Full donor profile w/ medical info
        ├── ProfileScreen.js        # My profile + before-donating guide
        ├── HistoryScreen.js        # Donation activity history
        ├── ProjectScreen.js        # Fundraising campaigns
        └── SettingsScreen.js       # App settings + notifications
```

---

## 🚀 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npx expo start
```

### 3. Run on device

- Press `a` for Android emulator
- Press `i` for iOS simulator
- Scan QR with Expo Go app on your phone

---

## ✨ Features

### Authentication

- **Login** — Animated hero with floating droplet, email/password
- **Register** — 3-step wizard: Personal → Medical → Account
  - Blood group selector (chip UI)
  - District selector
  - Medical condition toggles (smoker, Hepatitis B/C, HIV, diabetes, etc.)

### Home Screen

- Live stats: total donors, lives saved, active requests
- **Urgent Requests** horizontal carousel with pulsing blood group badge
- Blood group filter pills
- Donor cards with availability indicator, distance, donation count
- Tap donor → full detail screen

### Donor Detail Screen

- Full blood safety profile (8 conditions shown as green/red badges)
- Hemoglobin + blood pressure vitals
- Donation history & eligibility info
- Contact CTA

### My Profile Screen

- Donation progress toward "Gold Donor" (10 donations)
- Before Donating guide (6 essential tips)
- Medical profile summary
- Full donation history

### Projects Screen

- Community fundraising campaigns
- Progress bars with ৳ amounts
- Category filter (Emergency, Oncology, Infrastructure)
- Featured banner + urgent ribbons

### History Screen

- Yearly activity overview with monthly dot grid
- Eligibility status card
- Detailed activity cards with impact tags

### Settings Screen

- Availability toggle (show in search)
- Notification preferences
- Account management

---

## 🎨 Design System

| Token         | Value                  |
| ------------- | ---------------------- |
| Primary       | `#C62828`              |
| Primary Dark  | `#8E0000`              |
| Success       | `#43A047`              |
| Warning       | `#FB8C00`              |
| Border Radius | 8 / 14 / 20 / 28px     |
| Shadows       | small / medium / large |

---

## 🔌 Backend Integration

Replace the hardcoded `userData`, `DONORS`, etc. with API calls:

```js
// Example: Fetch donors
const fetchDonors = async () => {
  const res = await fetch(
    "https://your-api.com/donors?blood=A+&district=Dhaka",
  );
  const data = await res.json();
  setDonors(data);
};
```

Recommended backend: **Node.js + Express + PostgreSQL** or **Supabase**

---

## 📦 Dependencies

- `@react-navigation/native` — Navigation
- `@react-navigation/native-stack` — Stack navigator
- `@react-navigation/bottom-tabs` — Tab bar
- `@expo/vector-icons` — Ionicons
- `react-native-screens` — Native screen optimization
- `react-native-safe-area-context` — Safe area
