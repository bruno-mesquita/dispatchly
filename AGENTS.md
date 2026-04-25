# AGENTS.md - Dispatchly Technical Context

This file serves as the primary technical context for AI agents (Gemini, Claude) and developers working on the `dispatchly` project.

> [!IMPORTANT]
> **Operational Knowledge:** For business rules, domain invariants, notification lifecycles, and the current implementation state, **always consult [MEMORY.md](MEMORY.md)** in conjunction with this file.

## Project Overview
`dispatchly` is a multi-channel Notification-as-a-Service (SaaS) platform built with the **Better T Stack**. It allows organizations to send emails (via Resend), SMS (via Twilio), and push notifications (via Expo) with full tracking, automatic retries via BullMQ, and template management.

### Key Technologies
- **Runtime:** Bun 1.3.12+
- **Monorepo Manager:** Turborepo
- **Frontend:** Next.js 16.2.0 (App Router)
- **Backend:** ElysiaJS 1.4.28
- **API Layer:** tRPC 11.16.0
- **Database:** MongoDB with Mongoose
- **Authentication:** Better Auth (with Organization & Admin plugins)
- **Queue System:** BullMQ + Redis
- **Payments:** Stripe
- **Desktop:** Tauri (for native desktop integration)
- **Styling:** TailwindCSS 4 + shadcn/ui
- **Quality:** Biome (linting/formatting), TypeScript 6

## Architecture & Monorepo Structure

Turborepo monorepo using Bun workspaces.

```
apps/
  web/       Next.js 16.2.0 frontend (port 3001)
  server/    Elysia server (port 3000) — mounts tRPC + Better-Auth
  admin/     Next.js admin panel
  client/    Tauri client app
  e2e/       Playwright E2E tests

packages/
  api/           tRPC routers (notificationsRouter, templatesRouter, billingRouter)
  auth/          Better-Auth config shared by server + web
  db/            Mongoose models: NotificationLog, Organization, Subscription, Template
  notifications/ Provider abstraction (Resend/email, Twilio/SMS, Expo/push) + BullMQ queues
  templates/     Template CRUD + variable interpolation ({{varName}} syntax)
  billing/       Stripe checkout/portal + plan quota enforcement
  env/           @t3-oss/env-core validated env
  ui/            shadcn/ui primitives shared across apps
  config/        Shared tsconfig base
```

### Request Flow
Web → tRPC client → `apps/server` (Elysia) → `packages/api` routers → `packages/db` (Mongoose/MongoDB).

**Notification send path:**
tRPC `notifications.send` → quota check (`@dispatchly/billing`) → create `NotificationLog` (status=pending) → `addToQueue` (BullMQ + Redis) → worker processes job → calls provider → updates log status.

### Key Data Models
- **Organization** — owns quota/usage counters per channel, plan tier, provider settings.
- **NotificationLog** — per-message record with status lifecycle: pending → sent → delivered/failed/bounced.
- **Subscription** — Stripe subscription state per org.
- **Template** — reusable content with `variables[]` array; `applyTemplate` does string replacement.

## Getting Started & Key Commands

### Installation
```bash
bun install
```

### Infrastructure (Docker)
```bash
bun run db:start     # Starts MongoDB via Docker
bun run redis:start  # Starts Redis via Docker
bun run db:stop      # Stops MongoDB
```

### Development
```bash
bun run dev          # Starts all applications (Web & Server)
bun run dev:web      # Starts only the Next.js frontend
bun run dev:server   # Starts only the Elysia backend
```

### Quality & Maintenance
```bash
bun run check        # Run Biome linting and formatting (auto-fix)
bun run check-types  # Run TypeScript type checking across the monorepo
bun run test         # Run tests using Bun's native test runner
```

### Desktop Development (Tauri)
```bash
cd apps/web && bun run desktop:dev    # Dev
cd apps/web && bun run desktop:build  # Build (requires static export config)
```

## Development Conventions

1. **AI Collaboration:** NEVER set yourself as a co-author of commits.
2. **File Size:** Keep files under 300 lines whenever possible; exceed only if strictly necessary for logic cohesion.
3. **Naming Conventions:** Use kebab-case for filenames (e.g., `my-dialog.tsx`), never PascalCase or camelCase.
4. **Export Pattern:** Always use **named exports**. Use `export default` ONLY when strictly required by the framework (e.g., Next.js pages or metadata).
5. **Security:** Always self-review code for security vulnerabilities (injection, auth bypass, exposed secrets) before finishing a task.
6. **Type Safety:** Always use `@dispatchly/env` for environment variables. Ensure all tRPC procedures use `protectedProcedure` or `adminProcedure`.
2. **UI Components:**
   - Shared primitives in `packages/ui/src/components`.
   - Add new shared components: `npx shadcn@latest add <component> -c packages/ui`.
   - Import: `import { ... } from "@dispatchly/ui/components/..."`.
3. **API Design:** New features as tRPC routers in `packages/api/src/routers`, registered in the main `appRouter`.
4. **Data Management:** All DB interactions use Mongoose models in `packages/db/src/models`.
5. **Notifications:** Use `addToQueue()` from `@dispatchly/notifications`; avoid calling providers directly in the API layer.
6. **Git Flow:** Husky and Lefthook configured for pre-commit checks. `bun run check` must pass before commit.
7. **Linting:** Biome (tabs, double quotes). `noExplicitAny` (warn), `useSortedClasses` for `clsx`/`cn`.

## Environment Variables

Server (`apps/server/.env`):

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MongoDB URI |
| `REDIS_URL` | Yes | BullMQ / Redis connection |
| `BETTER_AUTH_SECRET` | Yes | Secret for auth sessions |
| `BETTER_AUTH_URL` | Yes | Auth server base URL |
| `CORS_ORIGIN` | Yes | Frontend application URL |
| `RESEND_API_KEY` | Email | Key for Resend provider |
| `TWILIO_ACCOUNT_SID` | SMS | Twilio Account SID |
| `EXPO_ACCESS_TOKEN` | Push | Expo Push Notification token |
| `STRIPE_SECRET_KEY` | Billing | Stripe Secret for payments |

## Current Project Status
- **Infrastructure:** MongoDB, Redis, and BullMQ setup is complete.
- **Backend:** tRPC routers for Notifications, Templates, and Billing are implemented.
- **Providers:** Resend (Email), Twilio (SMS), and Expo (Push) integrations are ready.
- **Frontend:** Dashboard implementation is in progress (Phase 9: Dashboard).
