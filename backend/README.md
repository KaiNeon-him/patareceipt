# PataReceipt Backend (MVP — Kenya-First)

Node.js + Express API server with PostgreSQL. Default currency: KES. Kenyan phone number validation (+254/07XX format). M-Pesa integration stubs for Phase 3.

## Setup
1. Copy env vars: create a `.env` file based on the example below (not committed).
2. Install dependencies: `npm install`
3. Create the database: `createdb patareceipt`
4. Run schema: `psql -U postgres -d patareceipt -f database/schema.sql`
5. Start: `npm start`

## Environment Variables
| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | Server port |
| NODE_ENV | development | Environment |
| DB_HOST | localhost | PostgreSQL host |
| DB_PORT | 5432 | PostgreSQL port |
| DB_NAME | patareceipt | Database name |
| DB_USER | postgres | Database user |
| DB_PASSWORD | postgres | Database password |
| JWT_SECRET | patareceipt-secret-change-in-production | JWT signing secret |
| JWT_EXPIRES_IN | 7d | Access token expiry |
| CORS_ORIGIN | * | CORS allowed origin |
| APP_URL | https://patareceipt.com | Verification portal URL |
| MPESA_BASE_URL | https://api.safaricom.co.ke | M-Pesa Daraja API base (Phase 3) |
| MPESA_CONSUMER_KEY | — | Safaricom consumer key (Phase 3) |
| MPESA_CONSUMER_SECRET | — | Safaricom consumer secret (Phase 3) |
| MPESA_PASSKEY | — | Safaricom passkey (Phase 3) |
| MPESA_SHORTCODE | — | M-Pesa paybill/till number (Phase 3) |

## API Endpoints
### Auth
- `POST /api/auth/register` — register user
- `POST /api/auth/login` — login
- `GET /api/auth/me` — get profile (auth required)

### Receipts
- `POST /api/receipts` — create receipt (auth required)
- `GET /api/receipts` — list receipts (auth required)
- `GET /api/receipts/:id` — get receipt (auth required)
- `GET /api/receipts/:id/pdf` — download PDF (auth required)
- `POST /api/receipts/:id/viewed` — mark as viewed (auth required)

### Verification (public)
- `GET /api/verify/:receiptId` — verify a receipt (no auth, SHA-256 hash anchoring)
- `GET /api/verify/:receiptId/qr` — QR data for a receipt (auth required)

### Analytics
- `GET /api/analytics/stats` — user stats (auth required)

### M-Pesa (Phase 3 — stubbed)
- `POST /api/mpesa/stk-push` — initiate STK push payment (auth required)
- `POST /api/mpesa/callback` — M-Pesa callback URL (no auth)

## Health
- `GET /health` — service health check