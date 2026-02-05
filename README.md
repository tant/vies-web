# VIES - Industrial Bearings & Components

Website cho VIES - Nhà phân phối vòng bi và linh kiện công nghiệp chính hãng (SKF, FAG, NTN, TIMKEN).

## Tech Stack

- **Next.js 16.1** - React framework với App Router
- **PayloadCMS 3.74.0** - Headless CMS
- **PostgreSQL 16** - Database
- **Tailwind CSS 4.1** - Styling
- **next-intl** - Internationalization (VI, EN, KM)
- **Docker** - Containerization

## Development

### Prerequisites

- Node.js 24+
- pnpm 10+
- Docker & Docker Compose

### Quick Start với Docker

```bash
# Start all services (app + postgres)
docker compose up

# Access:
# - Frontend: http://localhost:3000
# - Admin: http://localhost:3000/admin
```

### Local Development (không Docker)

```bash
# Install dependencies
pnpm install

# Start PostgreSQL
docker compose up postgres -d

# Run development server
pnpm dev
```

### Environment Variables

Copy `.env.example` to `.env` and update values:

```env
DATABASE_URL=postgresql://vies:vies_dev@localhost:5432/vies
PAYLOAD_SECRET=your-secret-key
```

## Project Structure

```
src/
├── app/
│   ├── (frontend)/[locale]/    # Public pages với i18n
│   └── (payload)/              # PayloadCMS admin
├── collections/                 # Payload collections
├── i18n/                       # Internationalization config
└── payload.config.ts           # Payload configuration

messages/                       # Translation files
├── vi.json
├── en.json
└── km.json
```

## Database Backup & Restore

### Backup

```bash
# Create backup (custom format, recommended)
docker exec vies-web-postgres-1 pg_dump -U vies -d vies -F c > data/vies-backup-$(date +%Y%m%d-%H%M%S).dump
```

### Restore on another machine

```bash
# 1. Start PostgreSQL container
docker compose up postgres -d

# 2. Restore from backup
docker exec -i vies-web-postgres-1 pg_restore -U vies -d vies --clean --if-exists < data/vies-backup-YYYYMMDD-HHMMSS.dump
```

## Features

- Product catalog (display only)
- Multi-language support (Vietnamese, English)
- Product search & filtering
- Blog/News section
- Contact form
- Responsive design

## License

MIT
