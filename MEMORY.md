# MEMORY.md — Dispatchly Business Rules & Operational Knowledge

> Companion to [AGENTS.md](AGENTS.md).
> **AGENTS.md** = how to build (stack, file conventions, commands).
> **MEMORY.md** = invariants, business rules, operational policies, and current state that AI agents and developers need to generate correct code without re-reading the whole codebase.

---

## 1. Domain

Dispatchly is a multi-tenant **Notification-as-a-Service** SaaS. Customers (organizations) send transactional notifications across **email** (Resend / AWS SES / SendGrid), **SMS** (Twilio), and **push** (Expo) using reusable templates with `{{variable}}` interpolation, with per-channel quotas, retries, audit logs, and outbound webhooks for delivery events.

**Tenancy model**
- Top-level tenant: **Organization** (every notification, template, log, webhook, subscription is scoped to one `orgId`).
- A user may belong to multiple organizations (Better Auth `organization` plugin). The active org is derived from the session.
- **Invariant:** never accept `orgId` from request body — always read from `ctx.session.activeOrganizationId` via `protectedProcedure`. Same rule for `userId`.
- **Invariant:** admin endpoints (`adminProcedure`) bypass org scope only when the user email is in `ADMIN_EMAILS` (CSV env var). Everything else stays org-scoped.

---

## 2. Notification lifecycle

```
        ┌──────────────────────────────────────┐
        │  client tRPC notifications.send      │
        │  (validate → check quota → enqueue)  │
        └──────────────────────────────────────┘
                          │
                          ▼
   create NotificationLog { status: "pending" }
                          │
                          ▼
        BullMQ enqueue (channel-specific queue)
                          │
                          ▼
        worker picks job → calls provider
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
   status: sent     status: failed   status: bounced (email)
        │                                   
        ▼ (provider async callback)
   status: delivered
```

Status enum (see `packages/db/src/models/notification-log.model.ts`):
`pending → sent → delivered | failed | bounced`

Semantics:
- **pending** — created, not yet handed to provider.
- **sent** — provider accepted the request (HTTP 2xx). Not yet confirmed reaching the recipient.
- **delivered** — provider asynchronously confirmed delivery (Resend/Twilio/Expo callback).
- **failed** — provider rejected or all retries exhausted. Terminal.
- **bounced** — email-only. Hard or soft bounce reported by Resend/SES. Terminal.

**Invariants**
- Status is monotonically forward (never `delivered → pending`). Workers must validate transitions.
- Outbound webhooks fire **once per terminal transition** (`delivered`, `failed`, `bounced`).
- Never call providers directly from API/route handlers — always `addToQueue()` from `@dispatchly/notifications`. Direct calls bypass quota, retry, and logging.

---

## 3. Quotas & billing

### Plans (source of truth: `packages/billing/src/index.ts` → `PLANS`)

| Plan | Monthly price (USD) | Email | SMS | Push |
|---|---|---|---|---|
| `free` | $0 | 100 | 50 | 100 |
| `basic` | $29.00 | 1,000 | 500 | 500 |
| `pro` | $99.00 | 10,000 | 5,000 | 5,000 |
| `enterprise` | custom | ∞ (limit `-1`) | ∞ | ∞ |

Stripe stores price as cents (`2900`, `9900`). Display divides by 100.

### Quota rules
- **Quota check happens BEFORE enqueue** in `checkQuota(orgId, channel)` (`packages/billing`). Failure returns 429 / TRPC `TOO_MANY_REQUESTS`.
- **Usage is incremented at enqueue time**, not delivery time. Rationale: prevents over-sending if delivery is delayed.
- **Counter location:** `Organization.usage.{emails,sms,push}` (Mongoose `$inc`).
- **Source of truth for limits:** `PLANS[plan].limits` — never read limits from `Organization` (the legacy `Organization.quota` field is being removed; do not write to it).
- **Reset cadence:** monthly, aligned to `Subscription.currentPeriodStart`. A BullMQ repeatable job zeroes `usage` at rollover; archive previous month into `usage_history` (planned).
- **Enterprise:** `limit === -1` → unlimited. `checkQuota` short-circuits to allowed.
- **Past-due / canceled:** if `Subscription.status` ∈ {`past_due`, `canceled`}, downgrade behavior to free-tier limits until resolved.

### Stripe ↔ local mirror
- Stripe is the **system of record for plan & subscription state**.
- Local `Subscription` model mirrors: `stripeCustomerId`, `stripeSubscriptionId`, `plan`, `status`, `currentPeriodStart`, `currentPeriodEnd`.
- Mirror is updated only by webhook handlers (`packages/billing` → `handleWebhook`). **Never** mutate plan/status from app code directly.
- Stripe API version pinned: `2026-03-25.dahlia`.

---

## 4. Templates

- Storage: `Template` model (`packages/db/src/models/template.model.ts`).
- Syntax: `{{variableName}}` — replaced by `applyTemplate()` in `packages/templates`.
- Declared variables live in `Template.variables[]` (string array). Send must validate that all declared variables are present in the payload before enqueueing — failing fast prevents wasted quota.
- Templates are **org-scoped**. Cross-org reuse not supported (planned: "system" templates manageable by admin only).
- Channels supported per template: `email`, `sms`, `push` (enum). One template can target multiple channels via `channels[]`.

---

## 5. Channels & providers

| Channel | Default | Alternatives | Selection |
|---|---|---|---|
| email | Resend | AWS SES, SendGrid | `Organization.settings.emailProvider` |
| sms | Twilio | (none) | hardcoded |
| push | Expo | (none) | hardcoded |

**Invariants**
- Provider abstraction lives in `packages/notifications`. Routes/UI never import provider SDKs directly.
- Provider failures must surface as `NotificationLog.status = failed` with `error` field populated. Never silently swallow.
- Provider keys live in `apps/server` env only — never expose to web/admin/client.

---

## 6. Queues (BullMQ + Redis)

- **One queue per channel** plus a retry queue: `email`, `sms`, `push`, `retry`.
- Retry policy: **3 attempts, exponential backoff base 60s** (job options `attempts: 3`, `backoff: { type: "exponential", delay: 60000 }`).
- Worker is responsible for: provider call, `NotificationLog` status update, outbound webhook dispatch on terminal transitions.
- **No dead-letter queue today.** Failed jobs after retry exhaustion stay in BullMQ failed set; surface in admin/logs UI.

---

## 7. Auth & authorization

- **Library:** Better Auth.
- **Plugins enabled:** `organization`, `admin`, `apiKey` (`@better-auth/api-key`), `stripe` (`@better-auth/stripe`).
- **Session transports:**
  - Browser (web/admin/client apps): cookie-based session.
  - SDK / server-to-server: Bearer **API key** (`Authorization: Bearer <key>`) — created per-org.
- **Procedure tiers (tRPC):**
  - `publicProcedure` — sign-up, login, public health.
  - `protectedProcedure` — requires session, injects `userId` and `orgId` into ctx.
  - `adminProcedure` — requires session **and** user email in `ADMIN_EMAILS` env (CSV).
- **Email verification:** required before first send (planned — currently bypassed).

---

## 8. Inbound webhooks (Stripe → Dispatchly)

- **Endpoint:** mounted on `apps/server` (Elysia route).
- **Secret:** `STRIPE_WEBHOOK_SECRET` (validated via `stripe.webhooks.constructEvent`).
- **Events handled** (`packages/billing/src/index.ts` → `handleWebhook`):
  - `customer.subscription.created` — upsert local Subscription with plan, status, period dates, **and `stripeCustomerId`** (must capture from `event.data.object.customer`).
  - `customer.subscription.updated` — sync plan/status/period.
  - `customer.subscription.deleted` — set `status: canceled`.
  - `invoice.payment_failed` (planned) — set `status: past_due`.
  - `checkout.session.completed` (planned) — link `stripeCustomerId` if missing.
- **Invariant:** webhook handler is **idempotent** — Stripe retries on 5xx, so mutations use upsert/`findOneAndUpdate`.

---

## 9. Outbound webhooks (Dispatchly → customer)

- Configured per-org via `Organization.settings.webhookUrl` and `webhookSecret`.
- **Signature:** header `X-Dispatchly-Signature: sha256=<hex>` where the HMAC-SHA256 is computed over the raw JSON body using `webhookSecret`.
- **Retry policy:** 3 attempts, exponential backoff. Permanent failure after 24h → marked dead, surfaced in `apps/admin/webhooks` UI.
- **Events emitted:**
  - `notification.sent` — provider accepted.
  - `notification.delivered` — async confirmation.
  - `notification.failed` — terminal failure after retries.
  - `notification.bounced` — email bounce (hard/soft).
- Customer endpoints must respond 2xx within 10s; otherwise treated as failure.

---

## 10. Current implementation state (snapshot 2026-04-25)

**Backend** (`apps/server` + `packages/api`)
- ✅ tRPC routers: admin, billing, notifications, organization, templates.
- ✅ Provider integrations: Resend, Twilio, Expo.
- ✅ BullMQ workers wired.
- ⚠️ `checkQuota` does not subtract usage (launch blocker — fix in progress).
- ⚠️ Webhook handler does not persist `stripeCustomerId` (breaks customer portal).
- ⚠️ No `invoice.payment_failed` / `checkout.session.completed` handling.
- ❌ No usage reset cron.
- ❌ No rate-limit middleware.
- ❌ No audit log.

**Customer dashboard** (`apps/client`)
- ✅ Pages: batch send, single send, templates, billing, settings, webhooks, logs.
- ⚠️ Dashboard overview is a 18-line stub.

**Admin panel** (`apps/admin`)
- ✅ Pages: home, templates, users, webhooks, organization detail (`[id]`).
- ⚠️ Stub pages (18 lines each): organizations list, analytics, subscriptions, logs.

**Marketing / desktop**
- ✅ `apps/web` landing page with shadcn design system.
- ⚠️ Tauri desktop wrapper exists in `apps/client/src-tauri` but build not validated → **deferred to post-GA**.

**Infrastructure**
- ❌ No Dockerfile.
- ❌ No CI/CD config.
- ⚠️ Tests: 1 router test + 0 UI/E2E.

**Launch decision:** Web-only first release. Tauri ships post-GA. See [Roadmap to GA](#13-roadmap-to-ga).

---

## 11. Operational conventions (non-obvious)

These are rules that experienced contributors break by accident — keep them in mind:

- **NEVER** co-author commits as AI (per `AGENTS.md` §1).
- **NEVER** call notification providers from API/route handlers — always go through `addToQueue()`.
- **NEVER** accept `orgId` or `userId` from the request body — always derive from session.
- **NEVER** mutate `Subscription.plan` or `status` outside the Stripe webhook handler.
- **NEVER** read quota limits from `Organization.quota` — read from `PLANS[plan].limits` in `packages/billing`.
- **NEVER** use `export default` except where Next.js requires it (page, layout, error, loading, route, metadata).
- **ALWAYS** use `@dispatchly/env` for env vars (typed, validated at boot).
- **ALWAYS** use named exports, kebab-case filenames, files under 300 LoC.
- **ALWAYS** ensure tRPC procedures use `protectedProcedure` or `adminProcedure` (never `publicProcedure` for data mutations).
- **ALWAYS** make webhook handlers idempotent — Stripe retries.
- `bun run check` (Biome) and `bun run check-types` (TypeScript) must pass pre-commit (Husky + Lefthook enforce).

---

## 12. Environment variables (quick reference)

Defined in `apps/server/.env`, validated by `@dispatchly/env`. See `turbo.json` `globalPassThroughEnv` for the full set.

| Variable | Purpose | Required |
|---|---|---|
| `DATABASE_URL` | MongoDB URI | yes |
| `REDIS_URL` | BullMQ + Redis | yes |
| `BETTER_AUTH_SECRET` | Auth session signing key | yes |
| `BETTER_AUTH_URL` | Auth server base URL | yes |
| `CORS_ORIGIN` | Frontend origin allowlist | yes |
| `ADMIN_EMAILS` | CSV of admin user emails | yes |
| `RESEND_API_KEY` | Email provider | email |
| `RESEND_FROM_EMAIL` | Default sender | email |
| `TWILIO_ACCOUNT_SID` | SMS provider | sms |
| `TWILIO_AUTH_TOKEN` | SMS provider | sms |
| `TWILIO_PHONE_NUMBER` | Default sender number | sms |
| `EXPO_ACCESS_TOKEN` | Push provider | push |
| `STRIPE_SECRET_KEY` | Billing | billing |
| `STRIPE_WEBHOOK_SECRET` | Billing webhook validation | billing |
| `NEXT_PUBLIC_BETTER_AUTH_URL` | Frontend auth base URL | yes |
| `NEXT_PUBLIC_SERVER_URL` | Frontend tRPC base URL | yes |

---

## 13. Roadmap to GA

Ordered execution plan. Total estimate: **3.5 – 4.5 days** of focused work for web-only GA.

### Phase A — Critical billing fixes (1 day)
1. Fix `checkQuota` to subtract `Organization.usage[type]` from `PLANS[plan].limits[type]`.
2. Fix Stripe webhook to persist `stripeCustomerId`; remove `as any`; type via `Stripe.Subscription`.
3. Handle `invoice.payment_failed` → `past_due`.
4. Handle `checkout.session.completed` → link `stripeCustomerId`.
5. BullMQ repeatable cron to reset `Organization.usage` on `currentPeriodStart` rollover.
6. Remove redundant `Organization.quota` field; migrate code to read `PLANS`.

### Phase B — Complete missing UI (1 – 2 days)
7. `apps/client/.../dashboard/page.tsx` — overview KPIs (envios mês por canal, % quota usada, últimos 5 logs).
8. `apps/admin/.../organizations/page.tsx` — paginated list (links to existing `[id]` detail).
9. `apps/admin/.../subscriptions/page.tsx` — orgs + plan + Stripe status + current period.
10. `apps/admin/.../analytics/page.tsx` — global totals per channel, top 10 orgs by volume.
11. `apps/admin/.../logs/page.tsx` — cross-org search, filter by channel/status, cursor pagination.

### Phase C — Pre-prod hardening (1 day)
12. Rate-limit middleware in `apps/server` (1k req/min per api-key, 100 req/min per IP for auth).
13. Email verification flow via Better Auth + `/verify-email` page.
14. Verify/implement HMAC signing on outbound webhooks.
15. Minimal audit log (`audit_log` collection + `adminProcedure` middleware).
16. E2E happy path in `apps/e2e`: signup → create org → create template → send email → see log.

### Phase D — Deploy (0.5 day)
17. Multi-stage Dockerfiles for server (Bun) and web/admin/client (Next standalone).
18. Deploy: Vercel for web/admin/client; Fly.io or Render for server (needs Redis); MongoDB Atlas.
19. Configure prod env: live Stripe keys, webhook endpoint pointing to server prod URL.
20. Prod smoke: real signup → upgrade Basic via Stripe live → send 1 email/sms/push → verify quota and outbound webhook.

### Phase E — Post-launch (does not block GA)
- Tauri desktop release (mac/win/linux).
- SDK enrichment in `packages/sdk`: retry, batch, event subscription, tRPC types.
- Broader test coverage (unit tests for billing, templates, notifications).
- Observability (Sentry + Better Stack or Axiom).
- In-app plan upgrade/downgrade (today only via Stripe checkout).
- "System" templates editable by admin only.

---

## 14. Key commands

```bash
# Install
bun install

# Infrastructure (Docker)
bun run db:start         # MongoDB
bun run redis:start      # Redis

# Development
bun run dev              # all apps
bun run dev:server       # apps/server (Elysia, port 3000)
bun run dev:web          # apps/web (Next, port 3001)
bun run dev:admin        # apps/admin
bun run dev:client       # apps/client (port 3003)

# Quality
bun run check            # Biome lint + format (auto-fix)
bun run check-types      # TypeScript across monorepo
bun run test             # Bun unit tests
bun run test:e2e         # Playwright (apps/e2e)

# Tauri (post-GA, not blocking launch)
cd apps/client && bun run desktop:dev
cd apps/client && bun run desktop:build
```
