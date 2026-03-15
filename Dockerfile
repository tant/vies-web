# Multi-stage Dockerfile for Next.js + PayloadCMS production deployment
# Requires `output: 'standalone'` in next.config.mjs

FROM node:22.17.0-alpine AS base

# ---------------------------------------------------------------------------
# Stage 1: Install dependencies
# ---------------------------------------------------------------------------
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm i --frozen-lockfile

# ---------------------------------------------------------------------------
# Stage 2: Build the application
# ---------------------------------------------------------------------------
FROM base AS builder
WORKDIR /app

# Build-time args — PayloadCMS initializes during `next build` and needs DB access
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SITE_URL

ENV DATABASE_URL=${DATABASE_URL}
ENV PAYLOAD_SECRET=${PAYLOAD_SECRET}
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN corepack enable pnpm && pnpm run build

# ---------------------------------------------------------------------------
# Stage 3: Production runner
# ---------------------------------------------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

# Prerender cache directory
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Media upload directory — mount a persistent volume here
RUN mkdir -p /app/media
RUN chown nextjs:nodejs /app/media

# Standalone output + static files
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# prodMigrations in payload.config.ts auto-runs pending migrations on startup
CMD ["node", "server.js"]
