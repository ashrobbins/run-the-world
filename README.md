# Run the World

A running-adventure web app — your real Strava runs move you along a chosen
real-world journey through checkpoints toward a destination.

This is the **Phase 1** slice: connect Strava → see one seeded journey
(Winchester → Sydney) → sync a run → watch progress update → see the
checkpoint-unlocked celebration when you cross one. See
`/Users/ash.robbins/.claude/plans/deep-juggling-goose.md` for the full plan.

## Prerequisites

1. **Supabase project** — either a hosted project (supabase.com) or the local
   dev stack via `npx supabase start` (needs Docker running).
2. **Strava API app** — register one at
   [developers.strava.com](https://developers.strava.com). Standard-tier
   access requires an active Strava subscription on the developer's account
   (2026 API policy). Set the Authorization Callback Domain to `localhost`
   for local dev.
3. **Mapbox token** (optional for now) — without it the map card shows a
   placeholder instead of a real map image.

## Setup

```bash
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
# SUPABASE_SERVICE_ROLE_KEY, STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET,
# NEXT_PUBLIC_MAPBOX_TOKEN

npm install
npx supabase db push   # applies supabase/migrations against your project
# then run supabase/seed.sql against the same project (SQL editor, or
# `psql "$DATABASE_URL" -f supabase/seed.sql`) to create the seeded journey

npm run dev
```

Visit `http://localhost:3000`, sign in with a magic link, then connect
Strava from the Home screen's "Link with Strava" card.

## Scripts

- `npm run dev` — local dev server
- `npm run build` — production build
- `npm test` — run the vitest suite (checkpoint progress logic, flag renderer)
- `npm run lint` — ESLint

## Architecture notes

- **Data retention**: `lib/strava/import.ts` implements the "derive-then-discard"
  pipeline — raw Strava activity payloads never leave that function's scope.
  Only distance/type/date and the Strava activity ID (for dedup) are stored.
- **CheckpointMarker** (`components/checkpoint-marker/`) renders a country's
  flag as a small circular marker from a data table
  (`flags.ts`) rather than per-country image assets — see the file for the
  ~95 supported country codes.
- **Login vs. Strava**: signing into the app (Supabase magic-link auth) and
  connecting Strava (OAuth for activity data) are deliberately separate —
  see the plan's "Open decisions" section for why.
