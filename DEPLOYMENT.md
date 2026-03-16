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

| Environment | URL                         | Branch    | Auto-deploy |
|-------------|-----------------------------|-----------|-------------|
| Staging     | https://staging.vies.com.vn | staging   | Yes (Dokploy) |
| Production  | https://v-ies.com           | main      | Manual      |

---

## Database Schema Management

PayloadCMS sử dụng **`push: true`** (Drizzle ORM push mode) cho cả development và production:

- Khi app khởi động, PayloadCMS tự động so sánh schema trong config với database
- Nếu có thay đổi (thêm field, collection...), schema được sync trực tiếp vào DB
- **Không cần tạo file migration thủ công** — mọi thứ tự động

> **Tại sao không dùng `prodMigrations`?**
> Migration modules không được bundle đúng trong Next.js standalone Docker build, nên dùng `push: true` thay thế.

### Lưu ý quan trọng

- `push: true` **tự động thêm** columns/tables mới nhưng **không tự xóa** columns/tables cũ
- Nếu cần xóa column/table, phải thao tác trực tiếp trên database
- Khi thay đổi collection/field, chỉ cần commit code và deploy — schema tự sync khi container khởi động

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

# 4. Commit
git add .
git commit -m "feat: describe your change"

# 6. Push and create a PR targeting `staging` branch
git push origin feature/my-change
# Create PR → merge into `staging` → auto-deploys to staging.vies.com.vn
# When ready for production, merge `staging` into `main`
```

---

## Staging Deployment

### Prerequisites

- Access to [Dokploy dashboard](https://wedeploy.carp.vn)
- Git push access to `https://github.com/tant/vies-web.git`

### How It Works

1. **Push to `staging`** → Dokploy detects the change and triggers a build
2. **Docker build** → Multi-stage build using the project `Dockerfile`
3. **Container starts** → `push: true` auto-syncs database schema
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

> **Build args**: `PAYLOAD_SECRET` and `NEXT_PUBLIC_SITE_URL` must also be set as **build-time arguments** in Dokploy. `DATABASE_URL` uses a placeholder at build time (hardcoded in Dockerfile) and the real value is injected at runtime.

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

## Docker Build (Local Testing)

```bash
# Build the Docker image locally
docker build \
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

---

## Troubleshooting

**Build fails:**
- Check Dokploy build logs under **Deployments** tab
- Common cause: Missing build-time env vars (PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL)
- Verify the database service is running before building

**App crashes on startup:**
- Check container logs in Dokploy
- Usually a DATABASE_URL connection issue — verify the DB service hostname matches

**Media files missing after redeploy:**
- Ensure persistent volume is mounted at `/app/media`
- Check Dokploy → vies-app → Advanced → Volumes

**Migration fails:**
- Check logs for SQL errors
- Run `pnpm migrate:status` to see which migrations are pending/applied
- You may need to manually fix the migration or reset the `payload_migrations` table
- Connect to DB: Dokploy → vies-staging-db → Terminal
