# Nuzio Backend

Express + MongoDB API for the Nuzio AI audio-briefing app (onboarding, auth, daily briefs, discover feed, settings, billing).

## Setup

```bash
npm install
cp .env.example .env   # fill in MONGO_URI, JWT secrets, GOOGLE_CLIENT_ID
npm run seed            # loads sample stories
npm run dev
```

Server runs on `http://localhost:5000`, API mounted at `/api/v1`.

## Frontend

The `frontend/` folder is a separate Next.js app that consumes this API — see [frontend/README.md](frontend/README.md). Run the backend first (with MongoDB up and seeded), then `cd frontend && npm install && npm run dev`.

## Endpoints

**Auth** — `/api/v1/auth`
- `POST /register` `{ name, email, password }`
- `POST /login` `{ email, password }`
- `POST /google` `{ idToken }` — Google Sign-In
- `POST /refresh` `{ refreshToken }`
- `POST /logout` (auth)
- `GET /me` (auth)

**Onboarding** — `/api/v1/onboarding`
- `GET /catalog` — languages, professions, niches, voices, brief lengths, time slots
- `PUT /language` `{ language, locationEnabled?, city? }` (auth)
- `PUT /profession` `{ profession }` (auth)
- `PUT /niches` `{ niches: [] }` — up to 7 (auth)
- `PUT /voice` `{ voiceId, briefLengthId, customBriefMinutes? }` (auth)
- `PUT /schedule` `{ deliveryPeriod: 'AM'|'PM', deliveryTime: 'HH:mm' }` (auth)
- `PUT /notifications` `{ notificationsEnabled }` — completes onboarding (auth)

**Briefs** — `/api/v1/briefs` (auth)
- `GET /today` — today's brief, auto-generated from the user's niches/voice/length
- `GET /history`
- `GET /:id`
- `PATCH /:id/progress` `{ currentStoryIndex, currentPositionSec, isPlaying, playbackRate }`

**Discover** — `/api/v1/discover` (auth)
- `GET /?niche=AI+%26+Technology&q=claude&page=1&limit=20`

**Stories** — `/api/v1/stories` (auth)
- `GET /saved`
- `GET /:id`
- `POST /:id/save`
- `DELETE /:id/save`

**Settings** — `/api/v1/settings` (auth)
- `PATCH /profile` `{ name?, city?, avatarUrl? }`
- `PATCH /preferences` `{ theme?, offlineMode?, autoAdvance?, pushNotifications? }`
- `PATCH /notifications` `{ morningBrief?, breakingStory?, weeklyDigest? }`

**Notifications** — `/api/v1/notifications` (auth)
- `GET /`
- `PATCH /:id/read`
- `PATCH /read-all`

**Billing** — `/api/v1/billing`
- `GET /plans`
- `GET /current` (auth)
- `POST /upgrade` `{ planId: 'pro_monthly'|'pro_annual' }` (auth) — creates an order
- `POST /confirm` `{ orderId, providerPaymentId? }` (auth) — activates the plan
- `POST /cancel` (auth)

All authenticated routes expect `Authorization: Bearer <accessToken>`.
