# Dispatchly - SaaS de Notificações

> **Status:** Em desenvolvimento | **Última atualização:** 2026-04-17

---

## Visão Geral do Projeto

Dispatchly é um SaaS de notificações multi-canal que permite organizações enviarem emails, SMS e push notifications com tracking completo, retry automático e gestão de templates.

### Canais Suportados
- **Email:** Resend + (provedor fallback a definir)
- **SMS:** Twilio
- **Push:** Expo Server SDK

---

## Configurações Externas Necessárias

### Stripe Dashboard
1. Criar conta em stripe.com
2. Criar produtos (Free, Basic, Pro, Enterprise)
3. Obter API keys (secret, publishable)
4. Configurar webhook endpoint
5. Salvar price IDs em env vars

### Resend
1. Criar conta em resend.com
2. Adicionar domínio verificado (ou usar resend.dev)
3. Obter API key
4. Configurar webhook (opcional)

### Twilio
1. Criar conta em twilio.com
2. Comprar número de telefone
3. Obter Account SID e Auth Token
4. Configurar status callback webhook

### Expo
1. Criar projeto em expo.dev
2. Obter Access Token
3. Configurar push webhook (opcional)

### OAuth (Google/GitHub)
1. Google: Google Cloud Console → APIs → OAuth
2. GitHub: Developer Settings → OAuth Apps

---

## Stack Tecnológico

| Camada | Tecnologia | Versão |
|--------|-----------|--------|
| Runtime | Bun | 1.3.12 |
| Backend | ElysiaJS | 1.4.28 |
| Database | MongoDB (Mongoose) | 8.14.0 |
| Frontend | Next.js | 16.2.0 |
| Auth | Better Auth | 1.5.5 |
| API | tRPC | 11.16.0 |
| Queue | BullMQ | - |
| Queue Storage | Redis | - |
| Payments | Stripe + @better-auth/stripe | 1.4.20 |

### Dependencies a Instalar (Fase 2)
```bash
npm install @better-auth/stripe@^1.4.20 stripe@^22.0.0
```

---

## Decisões Tomadas

### Arquitetura
- **Decisão:** Manter ElysiaJS (não migrar para Fastify)
- **Rationale:** O código já está configurado com ElysiaJS, ecosystem mais leve

- **Decisão:** Instância única com dados separados por organização
- **Rationale:** Não precisa de multi-tenant com subdomínios separados

- **Decisão:** Multiplas organizações por usuário (plugin organization)
- **Rationale:** Usuários podem pertencer a múltiplas organizações

### Notificações
- **Decisão:** Sistema de filas com BullMQ + Redis
- **Rationale:** Retry automático, prioridade de jobs, monitoring

- **Decisão:** Rate limiting por organização com planos
- **Rationale:** Cada organização tem quota limitada baseada no plano

- **Decisão:** Templates customizáveis por organização
- **Rationale:** Cada cliente pode ter seus próprios templates

- **Decisão:** Webhooks externos para status de notificações
- **Rationale:** Sistemas externos precisam saber quando emails são entregues/falham

### Autenticação
- **Decisão:** Email + OAuth (Google, GitHub)
- **Rationale:** Login social para facilitar onboarding

- **Decisão:** Plugin admin() para painel administrativo
- **Rationale:** Separação clara entre usuários normais e admins

### Dados
- **Decisão:** Logs completos de todas as notificações
- **Rationale:** Rastreabilidade total - quem recebeu, quando, status

---

## Estrutura do Projeto

```
dispatchly/
├── apps/
│   ├── server/           # API Backend (ElysiaJS)
│   │   ├── src/
│   │   │   ├── index.ts
│   │   │   └── worker.ts   # BullMQ worker (separate process)
│   │   └── package.json
│   │
│   └── web/            # Frontend (Next.js 16)
│       └── src/
│           ├── app/
│           │   ├── (auth)/      # Login, signup, verify-email
│           │   │   ├── login/
│           │   │   ├── signup/
│           │   │   └── verify-email/
│           │   │
│           │   ├── dashboard/   # Dashboard principal
│           │   │   ├── page.tsx
│           │   │   ├── notifications/
│           │   │   │   ├── page.tsx        # Listar logs
│           │   │   │   ├── send/page.tsx    # Enviar 1 notificação
│           │   │   │   └── batch/page.tsx  # Enviar múltiplas
│           │   │   │
│           │   │   ├── templates/
│           │   │   │   ├── page.tsx
│           │   │   │   ├── new/page.tsx
│           │   │   │   └── [id]/page.tsx
│           │   │   │
│           │   │   ├── logs/
│           │   │   │   └── page.tsx
│           │   │   │
│           │   │   ├── settings/
│           │   │   │   ├── page.tsx        # Geral
│           │   │   │   └── webhook/page.tsx
│           │   │   │
│           │   │   └── billing/
│           │   │       ├── page.tsx
│           │   │       └── upgrade/page.tsx
│           │   │
│           │   ├── admin/        # Painel admin
│           │   │   ├── page.tsx
│           │   │   ├── organizations/
│           │   │   │   └── page.tsx
│           │   │   ├── subscriptions/
│           │   │   │   └── page.tsx
│           │   │   ├── logs/
│           │   │   │   └── page.tsx
│           │   │   ├── analytics/
│           │   │   │   └── page.tsx
│           │   │   └── settings/
│           │   │       └── page.tsx
│           │   │
│           │   └── api/
│           │       └── webhooks/
│           │           └── [orgId]/
│           │               └── route.ts   # Webhook endpoint
│           │
│           ├── components/
│           │   ├── ui/          # shadcn/ui components
│           │   ├── forms/       # TanStack Forms
│           │   └── layouts/     # Layout components
│           │
│           ├── lib/
│           │   ├── trpc.ts     # tRPC client
│           │   └── auth-client.ts
│           │
│           └── utils/
│               └── trpc.ts
│
├── packages/
│   ├── api/           # tRPC routers
│   │   └── src/
│   │       ├── routers/
│   │       │   ├── notifications.ts
│   │       │   ├── templates.ts
│   │       │   ├── webhooks.ts
│   │       │   ├── billing.ts
│   │       │   ├── organization.ts
│   │       │   └── admin.ts
│   │       ├── context.ts
│   │       ├── trpc.ts
│   │       └── index.ts
│   │
│   ├── auth/          # Better Auth + Plugins
│   │   └── src/
│   │       └── index.ts
│   │
│   ├── db/            # MongoDB + Schemas
│   │   ├── src/
│   │   │   ├── models/
│   │   │   │   ├── auth.model.ts    # User, Session, Account
│   │   │   │   ├── organization.model.ts
│   │   │   │   ├── notification-log.model.ts
│   │   │   │   ├── template.model.ts
│   │   │   │   ├── subscription.model.ts
│   │   │   │   └── webhook.model.ts
│   │   │   └── index.ts
│   │   └── docker-compose.yml
│   │
│   ├── env/           # Environment variables
│   │   └── src/
│   │       ├── server.ts
│   │       └── web.ts
│   │
│   ├── notifications/  # Providers + Queue (NOVO)
│   │   └── src/
│   │       ├── types/
│   │       │   └── index.ts      # Tipos de notificação
│   │       ├── providers/
│   │       │   ├── interface.ts  # Interface abstrata
│   │       │   ├── resend.ts
│   │       │   ├── twilio.ts
│   │       │   ├── expo.ts
│   │       │   └── index.ts
│   │       ├── queue/
│   │       │   ├── config.ts     # BullMQ config
│   │       │   ├── worker.ts    # Worker principal
│   │       │   ├── queues.ts   # Definição de filas
│   │       │   └── jobs.ts     # Job types
│   │       └── index.ts
│   │
│   ├── templates/      # Template management (NOVO)
│   │   └── src/
│   │       ├── types.ts
│   │       ├── service.ts
│   │       └── index.ts
│   │
│   ├── billing/       # Stripe + Plans (NOVO)
│   │   └── src/
│   │       ├── types.ts
│   │       ├── stripe.ts
│   │       ├── plans.ts
│   │       ├── quota.ts       # Quota checking
│   │       ├── webhook.ts    # Stripe webhook handler
│   │       └── index.ts
│   │
│   └── ui/           # shadcn/ui components
│   │
│   └── config/        # Biome + tsconfig
│
├── services/
│   └── worker/       # BullMQ worker processes
│       └── package.json
│
├── turbo.json        # Turborepo config
├── package.json    # Root package.json
├── bts.jsonc       # Better T Stack config
└── PROJECT.md     # Este arquivo
```

---

## Database Schema

### Índices (MongoDB)

```typescript
// organization.model.ts
{ slug: 1 }, { unique: true }
{ ownerId: 1 }

// notification-log.model.ts
{ orgId: 1, createdAt: -1 }
{ status: 1 }
{ type: 1 }
{ to: 1 }

// template.model.ts
{ orgId: 1, type: 1 }

// subscription.model.ts
{ orgId: 1 }, { unique: true }
{ stripeCustomerId: 1 }
{ stripeSubscriptionId: 1 }

// webhook.model.ts
{ orgId: 1 }
```

### Organizations
```typescript
{
  _id: ObjectId,
  name: String,
  slug: String,           // Identificador único
  ownerId: ObjectId,    // reference to user
  plan: 'free' | 'basic' | 'pro' | 'enterprise',
  quota: {
    emails: Number,
    sms: Number,
    push: Number
  },
  usage: {
    emails: Number,
    sms: Number,
    push: Number
  },
  settings: {
    emailProvider: 'resend' | 'aws-ses' | 'sendgrid',
    smsProvider: 'twilio',
    timezone: String,
    webhookUrl: String?,
    webhookSecret: String?
  },
  createdAt: Date,
  updatedAt: Date
}
```

### NotificationLogs
```typescript
{
  _id: ObjectId,
  orgId: ObjectId,
  type: 'email' | 'sms' | 'push',
  provider: String,
  to: String,
  templateId: ObjectId?,
  messageId: String,
  status: 'pending' | 'sent' | 'delivered' | 'failed' | 'bounced',
  error: String?,
  metadata: Object,
  sentAt: Date,
  deliveredAt: Date?,
  createdAt: Date
}
```

### Templates
```typescript
{
  _id: ObjectId,
  orgId: ObjectId,
  name: String,
  type: 'email' | 'sms' | 'push',
  subject: String?,
  content: String,
  variables: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Subscriptions
```typescript
{
  _id: ObjectId,
  orgId: ObjectId,
  stripeCustomerId: String,
  stripeSubscriptionId: String?,
  plan: String,
  status: 'active' | 'past_due' | 'canceled',
  currentPeriodStart: Date,
  currentPeriodEnd: Date,
  createdAt: Date
}
```

---

## Sistema de Filas (BullMQ)

### Filas
| Nome | Prioridade | Descrição |
|------|-----------|-----------|
| `notifications:email` | 10 | Emails via Resend |
| `notifications:sms` | 8 | SMS via Twilio |
| `notifications:push` | 8 | Push via Expo |
| `notifications:retry` | 5 | Retry de falhas |
| `notifications:webhook` | 3 | Webhook de status |

### Fluxo de Retry
```
Envio → Falha → Retry (1min) → Falha → Retry (5min) → Falha → Retry (30min) → Falha → Final (failed)
```

---

## Planos e Preços

| Plano | Emails/mês | SMS/mês | Push/mês | Preço |
|------|------------|---------|----------|----------|-------|
| Free | 100 | 50 | 100 | $0 |
| Basic | 1,000 | 500 | 500 | $29/mês |
| Pro | 10,000 | 5,000 | 5,000 | $99/mês |
| Enterprise | ∞ | ∞ | ∞ | Custom |

---

## Environment Variables

### Server (.env)
```bash
# Database
DATABASE_URL=mongodb://root:password@localhost:27017/dispatchly

# Auth
BETTER_AUTH_SECRET=    # min 32 chars
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3001

# Redis (para BullMQ)
REDIS_URL=redis://localhost:6379

# Email
RESEND_API_KEY=

# SMS
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Push
EXPO_ACCESS_TOKEN=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AWS (email fallback)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_SES_ENDPOINT=

# Node
NODE_ENV=development
```

### Web (.env)
```bash
NEXT_PUBLIC_API_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

### Variáveis no código (packages/env/src/server.ts)
```typescript
export const env = createEnv({
  server: {
    // Existing
    DATABASE_URL: z.string().min(1),
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    // NEW - Redis/BullMQ
    REDIS_URL: z.string().min(1),
    // NEW - Email providers
    RESEND_API_KEY: z.string().optional(),
    AWS_ACCESS_KEY_ID: z.string().optional(),
    AWS_SECRET_ACCESS_KEY: z.string().optional(),
    AWS_REGION: z.string().optional(),
    AWS_SES_ENDPOINT: z.string().optional(),
    // NEW - SMS
    TWILIO_ACCOUNT_SID: z.string().optional(),
    TWILIO_AUTH_TOKEN: z.string().optional(),
    TWILIO_PHONE_NUMBER: z.string().optional(),
    // NEW - Push
    EXPO_ACCESS_TOKEN: z.string().optional(),
    // NEW - Stripe
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
```

---

## APIs tRPC

### Notifications
```typescript
// Enviar notificação
notifications.send({
  type: 'email' | 'sms' | 'push',
  to: string,
  templateId?: string,
  subject?: string,      // para email
  content: string,
  variables?: object
})

// Enviar batch (até 100 por request)
notifications.batch({
  notifications: Notification[]
})

// Cancelar notificação pendente
notifications.cancel(id: string)

// Listar
notifications.list({
  type?: string,
  status?: string,
  limit?: number,
  offset?: number
})

// Stats (por período)
notifications.stats(startDate: Date, endDate: Date)
notifications.statsByOrg(orgId: string, startDate: Date, endDate: Date)
```

### Templates
```typescript
templates.list()
templates.create(data)
templates.update(id, data)
templates.delete(id)
```

### Webhooks
```typescript
webhooks.list()
webhooks.create(data)
webhooks.update(id, data)
webhooks.delete(id)
webhooks.test(id)
```

### Billing
```typescript
billing.getPlan()
billing.createCheckoutSession()
billing.createPortalSession()
billing.webhook()
```

### Organization
```typescript
organization.get()                  // Get current org
organization.list()                  // List all orgs user belongs to
organization.create(data: { name, slug })
organization.switch(orgId: string)    // Switch active org
organization.update(data: Partial<Organization>)
organization.updateSettings(data: Partial<OrganizationSettings>)
organization.getMembers()
organization.inviteMember(email: string, role: 'admin' | 'member')
organization.removeMember(userId: string)
organization.leave()                // Leave organization

// Quota
organization.getQuota()
organization.getUsage()
```

### Webhooks
```typescript
webhooks.list()
webhooks.create({
  url: string,
  events: string[],  // ['notification.sent', 'notification.delivered', 'notification.failed']
})
webhooks.update(id, data)
webhooks.delete(id)
webhooks.test(id)                  // Send test webhook

// Endpoint receiver
POST /api/webhooks/[orgId]          # Receive webhook from providers
```

### Admin (admin only)
```typescript
admin.listOrganizations(filters?: { plan?: string, status?: string })
admin.getOrganization(id: string)
admin.updateOrganization(id: string, data: Partial<Organization>)
admin.suspendOrganization(id: string)
admin.deleteOrganization(id: string)
admin.listSubscriptions()
admin.getSubscription(id: string)
admin.listLogs(filters?: { orgId?: string, type?: string, status?: string })
admin.getAnalytics()  // Global stats
admin.getOrgAnalytics(orgId: string)
```

### Webhook Endpoint (External)
```typescript
// Provider webhook receiver
POST /api/webhooks/[orgId]
  Body: { event: string, data: any }
  Headers: { 'x-webhook-signature': string }

// Server processing
- Verify signature
- Update notification status
- Trigger customer webhook if configured
```

---

## Testes

### Estrutura de Testes
```
packages/
├── api/
│   └── src/
│       ├── __tests__/
│       │   ├── notifications.test.ts
│       │   ├── templates.test.ts
│       │   └── billing.test.ts
│       └── routers/
│           └── __tests__/
│               └── utils/
│
├── notifications/
│   └── src/
│       ├── __tests__/
│       │   ├── providers/
│       │   │   ├── resend.test.ts
│       │   │   ├── twilio.test.ts
│       │   │   └── expo.test.ts
│       │   ├── queue/
│       │   │   ├── worker.test.ts
│       │   │   └── queues.test.ts
│       │   └── integration/
│       │       └── send-flow.test.ts
│
├── billing/
│   └── src/
│       └── __tests__/
│           ├── plans.test.ts
│           ├── quota.test.ts
│           └── webhook.test.ts
│
└── db/
    └── src/
        └── __tests__/
            ├── models/
            │   └── notification-log.test.ts
            └── utils/
```

### Scripts de Teste (package.json)
```json
{
  "test": "bun test",
  "test:watch": "bun test --watch",
  "test:coverage": "bun test --coverage"
}
```

### Biblioteca de Testes
- **Test runner:** Bun native test (`bun test`)
- **Mocking:** `bun test` built-in mock ou viest
- **Factories:** Mock helpers em `packages/__tests__/fixtures/`

### Abordagem de Testes
- **Unitários:** Testar funções isoladas
- **Integração:** Testar comunicação entre módulos
- **E2E:** Testar fluxos completos (ex: enviar notificação)

### Mocks Necesários
- MongoDB (usar `mongosh` ou mock em memória)
- Redis (usar `ioredis-mock` ou container dedicado)
- Providers (Resend, Twilio, Expo) - mockar APIs externas

---

## Checklist de Implementação

### Fase 1: Infraestrutura
- [ ] 1.1 Adicionar Redis ao docker-compose.yml
- [ ] 1.2 Adicionar novas env vars (packages/env/src/server.ts)
- [ ] 1.3 Criar scripts redis no package.json do db
  - `redis:start`: docker compose up -d redis
  - `redis:stop`: docker compose stop redis
  - `redis:down`: docker compose down
- [ ] 1.4 Configurar BullMQ com redis (packages/notifications/src/queue/config.ts)

### Fase 2: Auth (Better Auth Plugins)
- [ ] 2.1 Configurar plugin organization()
- [ ] 2.2 Configurar plugin admin()
- [ ] 2.3 Configurar plugin oauth() (Google, GitHub)
- [ ] 2.4 Configurar plugin stripe()
- [ ] 2.5 Atualizar context.ts para incluir organization
- [ ] 2.6 Criar procedure isOrgMember()
- [ ] 2.7 Criar procedure isOrgAdmin()

### Fase 3: Database Schemas
- [ ] 3.1 Criar organization.model.ts
- [ ] 3.2 Criar notification-log.model.ts
- [ ] 3.3 Criar template.model.ts
- [ ] 3.4 Criar subscription.model.ts
- [ ] 3.5 Criar webhook.model.ts
- [ ] 3.6 Exportar todos models em models/index.ts
- [ ] 3.7 Criar funções helper (save, find, update)

### Fase 4: Notification Providers
- [ ] 4.1 Criar package @dispatchly/notifications
- [ ] 4.2 Criar tipos de notificação (types/index.ts)
- [ ] 4.3 Implementar interface abstrata (providers/interface.ts)
- [ ] 4.4 Implementar provider Resend
- [ ] 4.5 Implementar provider Twilio
- [ ] 4.6 Implementar provider Expo
- [ ] 4.7 Criar factory paraProviders (providers/index.ts)
- [ ] 4.8 Adicionar testes de providers

### Fase 5: Queue System
- [ ] 5.1 Configurar BullMQ
- [ ] 5.2 Criar filas (email, sms, push, retry, webhook)
- [ ] 5.3 Implementar worker com retry logic
- [ ] 5.4 Criar testes de queue

### Fase 6: Templates
- [ ] 6.1 Criar package @dispatchly/templates
- [ ] 6.2 Implementar CRUD de templates
- [ ] 6.3 Adicionar rotas tRPC

### Fase 7: Billing
- [ ] 7.1 Criar package @dispatchly/billing
- [ ] 7.2 Configurar Stripe SDK
- [ ] 7.3 Definir planos (types.ts)
- [ ] 7.4 Implementar webhook handler (stripe webhook.ts)
- [ ] 7.5 Implementar quota middleware
- [ ] 7.6 Criar checkout session handler
- [ ] 7.7 Criar customer portal handler
- [ ] 7.8 Adicionar testes

### Fase 8: APIs tRPC
- [ ] 8.1 Implementar router notifications
- [ ] 8.2 Implementar router templates
- [ ] 8.3 Implementar router webhooks
- [ ] 8.4 Implementar router billing
- [ ] 8.5 Implementar router organization
- [ ] 8.6 Implementar router admin

### Fase 9: Frontend - Dashboard
- [ ] 9.1 Página de notifications/send - Enviar notificação única
- [ ] 9.2 Página de notifications/batch - Enviar múltiplas
- [ ] 9.3 Página de templates - Listar/criar/editar templates
- [ ] 9.4 Página de logs - Ver histórico de notificações
- [ ] 9.5 Página de settings - Config org (webhook, timezone, Providers)
- [ ] 9.6 Página de billing - Ver plano, Upgrade, Payment methods

### Fase 10: Frontend - Admin
- [ ] 10.1 Página /admin/organizations - Listar todas orgs
- [ ] 10.2 Página /admin/organizations/[id] - Detalhar org
- [ ] 10.3 Página /admin/subscriptions - Listar plans ativos
- [ ] 10.4 Página /admin/logs - Logs globais com filtros
- [ ] 10.5 Página /admin/analytics - Dashboard analytics
- [ ] 10.6 Página /admin/settings - Configurações globais

### Fase 11: Testes
- [ ] 11.1 Testes de providers
- [ ] 11.2 Testes de queue
- [ ] 11.3 Testes de APIs
- [ ] 11.4 Testes de billing/plans

---

## Pending Decisions

1. **2º provedor de email:** AWS SES, SendGrid ou Mailgun?
2. **URL de produção:** Qual será a URL final do SaaS?
3. **Analytics específicos:** Quais métricas além das listadas?

### OAuth Providers (a configurar)
```
# Google OAuth
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# GitHub OAuth
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

### Stripe Plans IDs
```
stripe_basic_plan_id=
stripe_pro_plan_id=
stripe_enterprise_plan_id=
```

---

## Notas para Agents

### Antes de implementar qualquer tarefa:
1. Leia este arquivo PROJECT.md
2. Verifique a Fase atual no checklist
3. Comunique-se com o usuário antes de fazer suposições

### Durante implementação:
1. Mantenha consistência com código existente
2. Use as bibliotecas já configuradas (ElysiaJS, tRPC, Mongoose, Next.js)
3. Adicione testes para cada nova funcionalidade
4. Use biome para linting

### Após implementação:
1. Rode `bun check` para linting
2. Rode `bun check-types` para typecheck
3. Rode `bun test` para testes
4. Atualize este arquivo se houver mudanças significativas