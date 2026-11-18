# PataReceipt Frontend (MVP + Full App)

React Native (Expo) mobile app.

## Screens
- Login / Register — authentication
- Dashboard — receipt list, analytics, templates, logout
- Create Receipt — multi-item receipt generator
- Receipt Detail — view, share PDF, verify, mark as viewed
- Verify — public receipt verification by ID
- Analytics — receipt stats and recent activity
- Templates — receipt template management
- Profile — business profile and logout

## Setup
1. Install dependencies: `npm install`
2. Set API URL: `export EXPO_PUBLIC_API_URL=http://your-backend:3000/api`
3. Start: `npm start` (Expo dev server)
4. Android: `npm run android` | iOS: `npm run ios` | Web: `npm run web`

## Environment
| Variable | Default | Description |
|----------|---------|-------------|
| EXPO_PUBLIC_API_URL | http://localhost:3000/api | Backend API base URL |