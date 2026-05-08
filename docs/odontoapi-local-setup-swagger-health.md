# OdontoAPI: Banco em Docker + Swagger + Healthcheck

## Objetivo

Executar a API localmente com o banco PostgreSQL em container, com documentacao Swagger e endpoint de healthcheck.

## Banco de Dados no Docker

Arquivo: `docker-compose.yml` na raiz do monorepo.

### Subir banco

```bash
docker compose up -d
```

### Derrubar banco

```bash
docker compose down
```

### Derrubar banco e apagar dados

```bash
docker compose down -v
```

## Variaveis de ambiente

Em `apps/odontoapi/.env` (copie de `.env.example`):

```env
DATABASE_URL="postgresql://odontoehtec:odontoehtec@localhost:5432/odontoehtec?schema=public"
PORT=3333
NODE_ENV=development
```

## Setup Prisma

No package da API (`apps/odontoapi`):

```bash
pnpm db:setup
```

## Rodar API local

```bash
pnpm dev
```

## Endpoints de suporte

- Healthcheck: `GET /api/health`
- Swagger UI: `GET /api/docs`
- Swagger JSON: `GET /api/docs-json`

## Scripts uteis da API

- `pnpm prisma:generate`
- `pnpm prisma:migrate:dev`
- `pnpm prisma:migrate:deploy`
- `pnpm prisma:db:push`
- `pnpm prisma:studio`
- `pnpm db:setup`
- `pnpm db:reset`
