# Tarefas de Implementação

## Fase Atual: 2 - Auth

## Fase 1: Infraestrutura ✅ COMPLETO

- [x] 1.1 Adicionar Redis ao docker-compose.yml
- [x] 1.2 Adicionar env vars
- [x] 1.3 Scripts redis

---

## Fase 2: Auth (próxima)

### Task 2.1: Configurar Better Auth plugins
**Arquivo:** `packages/auth/src/index.ts`

Plugins a adicionar:
- organization()
- admin()
- oauth()
- stripe()
**Arquivo:** `packages/db/docker-compose.yml`

Adicionar serviço redis:
```yaml
redis:
  image: redis:7-alpine
  container_name: dispatchly-redis
  ports:
    - "6379:6379"
  volumes:
    - dispatchly_redis_data:/data
  command: redis-server --appendonly yes
  restart: unless-stopped
```

### Task 1.2: Adicionar env vars
**Arquivo:** `packages/env/src/server.ts`

Adicionar:
```typescript
REDIS_URL: z.string().min(1),
RESEND_API_KEY: z.string().optional(),
TWILIO_ACCOUNT_SID: z.string().optional(),
TWILIO_AUTH_TOKEN: z.string().optional(),
TWILIO_PHONE_NUMBER: z.string().optional(),
EXPO_ACCESS_TOKEN: z.string().optional(),
STRIPE_SECRET_KEY: z.string().optional(),
STRIPE_WEBHOOK_SECRET: z.string().optional(),
```

### Task 1.3: Scripts redis
**Arquivo:** `packages/db/package.json`

Adicionar em scripts:
```json
"redis:start": "docker compose up -d redis",
"redis:stop": "docker compose stop redis",
"redis:down": "docker compose down"
```

---

## Como Executar

```bash
# Subir infra
bun run db:start && bun run redis:start

# Verificar
docker ps | grep dispatchly
```

---

## Fase 2: Auth (próxima)

Melhorar auth com plugins:
- organization()
- admin()
- oauth()
- stripe()

---

## Referência

Ver `PROJECT.md` para contexto completo.