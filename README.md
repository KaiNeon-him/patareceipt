# PataReceipt

Mobile-first invoice and receipt generation platform for informal freelancers and micro-entrepreneurs — Kenya-first, KES pricing.

## Stack
- Backend: Node.js + Express + PostgreSQL
- Frontend: React Native (Expo)
- PDF generation: PDFKit
- Auth: JWT + bcrypt
- Verification: SHA-256 hash anchoring, QR codes
- M-Pesa: Daraja API stubs (Phase 3)

## Market Data (2026)
- 703,700 informal-sector jobs created in Kenya in 2024 (KNBS/Treasury)
- 92.84M registered mobile money accounts (CBK, April 2026)
- 400,000–800,000 Kenyan freelancers/gig workers (Kaziiko, 2026)
- Default currency: KES (KSh 499/month Pro tier)

## Structure
- `backend/` — API server (auth, receipts, verification, analytics)
- `frontend/` — React Native mobile app
- `docs/` — GTM plan and pitch critique
- `docker-compose.yml` — full stack deployment

## Getting Started
### Backend
See `backend/README.md` for setup and API docs.

### Frontend
See `frontend/README.md` for setup instructions.

### Full Stack (Docker)
`docker-compose up`

## Order of Work
1. GTM plan — `docs/gtm.md`
2. MVP build — backend + frontend (this repo)
3. Pitch critique — `docs/critique.md`
4. Full app — verification, analytics, templates, Docker deployment

## Legal
- `LICENSE` — MIT License
- `EULA.md` — End User License Agreement
- `TERMS_OF_SERVICE.md` — Terms of Service
- `PRIVACY_POLICY.md` — Privacy Policy (incl. Kenya Data Protection Act 2019 compliance)