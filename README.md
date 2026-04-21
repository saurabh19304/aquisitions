# Aquisitions - Docker Setup with Neon (Dev and Prod)

This project uses Neon in two modes:

- Development: Neon Local container (creates ephemeral branches)
- Production: Neon Cloud URL directly (no local proxy)

## 1) Files Added

- Dockerfile
- docker-compose.dev.yml
- docker-compose.prod.yml
- .env.development
- .env.production
- .dockerignore

## 2) Environment Variables

### Development (`.env.development`)

Use Neon Local as the database endpoint:

- `DATABASE_URL=postgres://neon:npg@neon-local:5432/aquisitions_dev?sslmode=require`
- `NEON_FETCH_ENDPOINT=http://neon-local:5432/sql`
- `NEON_API_KEY=<from neon console>`
- `NEON_PROJECT_ID=<from neon console>`
- `PARENT_BRANCH_ID=<branch id used as parent for ephemeral branches>`

How it works:

- `neon-local` starts in Docker
- Neon Local creates an ephemeral branch from `PARENT_BRANCH_ID`
- App connects to `neon-local:5432` inside Docker network
- Branch is deleted when Neon Local container stops (default behavior)

### Production (`.env.production`)

Use Neon Cloud directly:

- `DATABASE_URL=postgres://...neon.tech...`
- Do not set or run Neon Local

## 3) Start Development (Neon Local)

1. Fill required values in `.env.development`:
   - `NEON_API_KEY`
   - `NEON_PROJECT_ID`
   - `PARENT_BRANCH_ID`
2. Start services:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development up --build
```

3. App is available at:

- `http://localhost:3000`
- Health check: `http://localhost:3000/health`

Stop services:

```bash
docker compose -f docker-compose.dev.yml --env-file .env.development down
```

## 4) Start Production (Neon Cloud)

1. Fill `.env.production` with your real Neon Cloud `DATABASE_URL` and app secrets.
2. Run:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production up --build -d
```

Stop:

```bash
docker compose -f docker-compose.prod.yml --env-file .env.production down
```

## 5) How Switching Works

- Development compose uses:
  - Neon Local service (`neondatabase/neon_local`)
  - App `DATABASE_URL` => `neon-local:5432`
- Production compose uses:
  - App only
  - App `DATABASE_URL` => Neon Cloud (`*.neon.tech`)

No code changes are needed when switching. Only env files and compose file selection change.

## 6) Notes

- The app now auto-configures Neon serverless HTTP mode when `DATABASE_URL` host is `neon-local` or `localhost`.
- Secrets stay in env files or deployment secret managers, not hardcoded in source.
