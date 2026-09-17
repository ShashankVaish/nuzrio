# Nuzio Frontend

Next.js (App Router) UI for Nuzio, matching the onboarding, home, discover, settings and billing screens. Talks to the Express backend in `../`.

## Setup

```bash
npm install
cp .env.local.example .env.local
# NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
# NEXT_PUBLIC_GOOGLE_CLIENT_ID=<google oauth web client id>
npm run dev
```

Open `http://localhost:3000`. The backend must be running (with MongoDB up and `npm run seed` applied) for anything past the language screen to work, since sign-in and onboarding are persisted through its API.

## Flow

`/` (splash) → `/language` → `/welcome` (Google sign-in) → `/onboarding/profession` → `/onboarding/niches` → `/onboarding/voice` → `/onboarding/schedule` → `/onboarding/notifications` → `/onboarding/ready` → `/home` (with `/discover` and `/settings` reachable from the bottom nav).

Auth state and access tokens live in `localStorage`; the currently playing brief is shared across pages through `PlayerContext` so the floating play button in the bottom nav always reflects it.

Without `NEXT_PUBLIC_GOOGLE_CLIENT_ID` set, the "Continue with Google" button will show a configuration notice instead of signing in — the rest of the UI still renders for visual review.
