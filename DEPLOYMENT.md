# VIES Deployment Guide

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Dokploy Server                     │
│              wedeploy.carp.vn                        │
│                                                      │
│  ┌─────────────────┐    ┌──────────────────────┐    │
│  │  vies-staging-db │    │   vies-staging-app    │    │
│  │  PostgreSQL 16   │◄───│   Next.js + Payload   │    │
│  │  (port 5432)     │    │   (port 3000)         │    │
│  └─────────────────┘    └──────────────────────┘    │
│                                 │                    │
│                          Traefik Proxy               │
│                                 │                    │
└─────────────────────────────────┼────────────────────┘
                                  │
                     https://staging.vies.com.vn
```

## Environments

| Environment | URL                         | Branch | Auto-deploy |
|-------------|-----------------------------|--------|-------------|
| Staging     | https://staging.vies.com.vn | main   | Yes (Dokploy) |
| Production  | https://v-ies.com           | main   | Manual      |

## Staging Deployment

### Prerequisites

- Access to [Dokploy dashboard](https://wedeploy.carp.vn)
- Git push access to `https://github.com/tant/vies-web.git`

### How It Works

1. **Push to `main`** → Dokploy detects the change and triggers a build
2. **Docker build** → Multi-stage build using the project `Dockerfile`
3. **Migrations** → Auto-run on container startup via `prodMigrations` in PayloadCMS config
4. **Live** → App is accessible at `https://staging.vies.com.vn`

### Deploy Manually from Dokploy

1. Go to https://wedeploy.carp.vn
2. Navigate to **Projects → vies → staging**
3. Click on **vies-app** service
4. Click **Deploy** (or **Redeploy**)
5. Monitor the build logs in the **Deployments** tab

### Environment Variables

These are configured in Dokploy under the app service settings:

| Variable               | Description                          | Example                                              |
|------------------------|--------------------------------------|------------------------------------------------------|
| `DATABASE_URL`         | PostgreSQL connection string         | `postgresql://vies:pass@vies-staging-db:5432/vies`   |
| `PAYLOAD_SECRET`       | Auth token encryption key (64+ chars)| `<random-string>`                                    |
| `NEXT_PUBLIC_SITE_URL` | Public URL for SEO and media links   | `https://staging.vies.com.vn`                        |

> **Build args**: `DATABASE_URL`, `PAYLOAD_SECRET`, and `NEXT_PUBLIC_SITE_URL` must also be set as **build-time arguments** in Dokploy because PayloadCMS initializes during `next build`.

### Database

- **Service**: `vies-staging-db` (PostgreSQL 16 Alpine)
- **Internal hostname**: `vies-staging-db` (accessible from app via Docker network)
- **Credentials**: Configured in Dokploy database service settings
- **Backups**: Configure automated backups in Dokploy → Database → Backups

### Media Files

Uploaded media files are stored at `/app/media` inside the container. A **persistent volume** must be mounted at this path in Dokploy to prevent data loss on redeployment.

To configure in Dokploy:
1. Go to **vies-app** → **Advanced** → **Volumes**
2. Add: `/app/media` → persistent volume

---

## Developer Workflow

### Local Development

```bash
# Start PostgreSQL
docker compose up postgres -d

# Install dependencies
pnpm install

# Run dev server
pnpm dev
```

App runs at http://localhost:3000
Admin panel at http://localhost:3000/admin

### Making Changes

```bash
# 1. Create a feature branch
git checkout -b feature/my-change

# 2. Make your changes and test locally
pnpm dev

# 3. Run tests
pnpm test:int          # Unit tests (Vitest)
pnpm test:e2e          # E2E tests (Playwright)

# 4. If you changed Payload collections/schemas, create a migration:
pnpm payload migrate:create

# 5. Commit (include migration files if any)
git add .
git commit -m "feat: describe your change"

# 6. Push and create a PR
git push origin feature/my-change
```

### Database Migrations

Migrations are auto-applied on deployment via `prodMigrations`. But you must **create** them locally:

```bash
# After changing any collection schema:
pnpm payload migrate:create

# This generates a file in src/migrations/
# Commit the migration file — it will auto-run on next deploy
```

### Testing Against Staging

After your PR is merged to `main` and deployed:

1. **Visit** https://staging.vies.com.vn — verify frontend renders correctly
2. **Admin panel** — https://staging.vies.com.vn/admin — test CMS operations
3. **Check all locales** — `/vi/` and `/en/` routes
4. **Test media uploads** — Upload an image in admin, verify it displays on frontend
5. **Test forms** — Submit a contact form, verify submission appears in admin

### Troubleshooting

**Build fails:**
- Check Dokploy build logs under **Deployments** tab
- Common cause: Missing build-time env vars (DATABASE_URL, PAYLOAD_SECRET)
- Verify the database service is running before building

**App crashes on startup:**
- Check container logs in Dokploy
- Usually a DATABASE_URL connection issue — verify the DB service hostname matches

**Media files missing after redeploy:**
- Ensure persistent volume is mounted at `/app/media`
- Check Dokploy → vies-app → Advanced → Volumes

**Migration fails:**
- Check logs for SQL errors
- You may need to manually fix the migration or reset the `payload_migrations` table
- Connect to DB: Dokploy → vies-staging-db → Terminal

---

## Docker Build (Local Testing)

```bash
# Build the Docker image locally
docker build \
  --build-arg DATABASE_URL="postgresql://vies:vies_dev@host.docker.internal:5432/vies" \
  --build-arg PAYLOAD_SECRET="test-secret-for-local-build-only" \
  --build-arg NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
  -t vies:local .

# Run it
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://vies:vies_dev@host.docker.internal:5432/vies" \
  -e PAYLOAD_SECRET="test-secret-for-local-build-only" \
  -e NEXT_PUBLIC_SITE_URL="http://localhost:3000" \
  -v vies_media:/app/media \
  vies:local
```

---

## Seed Data

To populate staging with test data:

```bash
# SSH into the Dokploy server, or run locally pointing at the staging DB:
pnpm seed
```

Or from Dokploy terminal in the app service container.
