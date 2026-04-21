# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun install              # Install dependencies
bun run dev              # Start all apps (web on :3001, server on :3000)
bun run dev:web          # Web only
bun run dev:server       # Server only
bun run build            # Build all apps via Turborepo
bun run check-types      # TypeScript check across all packages
bun run check            # Biome lint + format (auto-fix)

bun run db:start         # Start MongoDB via Docker
bun run db:stop          # Stop MongoDB container
bun run db:down          # Remove MongoDB container + volumes
```

No test runner is configured yet.

## Architecture

Turborepo monorepo. Bun workspace. Two apps, multiple shared packages.

```
apps/
  web/       Next.js 19 frontend (port 3001)
  server/    Elysia server (port 3000) — mounts tRPC + Better-Auth

packages/
  api/           tRPC routers (notificationsRouter, templatesRouter, billingRouter)
  auth/          Better-Auth config shared by server + web
  db/            Mongoose models: NotificationLog, Organization, Subscription, Template
  notifications/ Provider abstraction (Resend/email, Twilio/SMS, Expo/push) + BullMQ queues
  templates/     Template CRUD + variable interpolation ({{varName}} syntax)
  billing/       Stripe checkout/portal + plan quota enforcement (free/basic/pro/enterprise)
  env/           @t3-oss/env-core validated env — server.ts and web.ts
  ui/            shadcn/ui primitives shared across apps
  config/        Shared tsconfig base
```

### Request flow

Web → tRPC client → `apps/server` (Elysia) → `packages/api` routers → `packages/db` (Mongoose/MongoDB).

Notification send path: tRPC `notifications.send` → quota check (`@dispatchly/billing`) → create `NotificationLog` (status=pending) → `addToQueue` (BullMQ + Redis) → worker processes job → calls provider → updates log status.

### Key data models

- **Organization** — owns quota/usage counters per channel, plan tier, provider settings
- **NotificationLog** — per-message record with status lifecycle: pending → sent → delivered/failed/bounced
- **Subscription** — Stripe subscription state per org
- **Template** — reusable content with `variables[]` array; `applyTemplate` does string replacement

### Auth

Better-Auth (`packages/auth`). Session attached to tRPC context via `protectedProcedure`. `ctx.session.user.id` is used as `orgId` throughout routers.

## Environment variables

Server (`apps/server/.env`):

| Variable | Required |
|---|---|
| `DATABASE_URL` | MongoDB URI — yes |
| `REDIS_URL` | BullMQ — yes |
| `BETTER_AUTH_SECRET` | ≥32 chars — yes |
| `BETTER_AUTH_URL` | yes |
| `CORS_ORIGIN` | yes |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` | email |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_PHONE_NUMBER` | SMS |
| `EXPO_ACCESS_TOKEN` | push |
| `STRIPE_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET` | billing |

## Linting / formatting

Biome (tabs, double quotes). `bun run check` auto-fixes. Pre-commit runs `biome check --write` via lint-staged + Husky.

Biome rules to note: `noExplicitAny` (warn), `useSortedClasses` applies to `clsx`/`cva`/`cn` calls.

## Adding shadcn components

Components go in `packages/ui`. Use `shadcn` CLI from that package directory or use the `shadcn` skill.

## Desktop (Tauri)

```bash
cd apps/web && bun run desktop:dev    # Dev
cd apps/web && bun run desktop:build  # Build (requires static export config)
```
