# Church API (Starter)
Node + Express + Sequelize starter for a church website.

Quick start:
1. Copy `.env.example` to `.env` and fill DATABASE_URL, JWT_SECRET, STRIPE keys.
2. Install deps: `npm install`
3. Start: `npm run dev`

Notes:
- Uses Sequelize; by default will try to connect to DATABASE_URL. If not set, sqlite memory is used.
- Endpoints: /api/v1/auth, /api/v1/sermons, /api/v1/events, /api/v1/donations, /api/v1/prayers
