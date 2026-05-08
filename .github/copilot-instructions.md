# OdontoEhTec — Copilot Instructions

## Projeto
SaaS odontológico para gestão completa de clínicas e pacientes. Facilita o dia a dia
do dentista com agendamento, prontuário eletrônico, faturamento e relatórios clínicos.

## Monorepo

```
apps/landingpage   → Next.js 15 (App Router) — site público
apps/odontoapp     → Next.js 15 (App Router) — painel do dentista
apps/odontoapi     → NestJS 11 — REST API
packages/shared    → Tipos TypeScript e DTOs compartilhados
```

- Package manager: **pnpm** | Orquestrador: **Turborepo**
- Comandos raiz: `pnpm dev` | `pnpm build` | `pnpm lint` | `pnpm type-check`

## Arquitetura Hexagonal (odontoapi)

Estrutura **flat** dentro de `src/`. Dependências sempre apontam para dentro
(infrastructure → application → domain).

```
domain/entities/              → Classes de domínio puras, sem decorators de framework
domain/ports/in/              → Interfaces Input Port (contratos de casos de uso)
domain/ports/out/             → Interfaces Output Port (contratos de repositórios)
domain/value-objects/         → Objetos de valor imutáveis
application/use-cases/        → Implementações dos Input Ports; orquestram o domínio
infrastructure/adapters/in/   → Controllers NestJS (@Controller)
infrastructure/adapters/out/  → Repositórios Prisma implementando Output Ports
infrastructure/config/        → Módulos NestJS e configurações
```

**Regras invioláveis:**
- `domain/` nunca importa de `application/` ou `infrastructure/`
- `application/` nunca importa de `infrastructure/`
- Injeção de dependência via interfaces (Output Ports), nunca via implementações diretas
- Controllers recebem/retornam DTOs — nunca expõem entidades de domínio
- Entidades de domínio não utilizam decorators de framework (`@Injectable`, `@Column`, etc.)

## Convenções de Código
- TypeScript `strict: true` — `any` exige justificativa via comentário eslint-disable
- Retorno tipado explicitamente em todas as funções públicas da API
- Nomenclatura: `PascalCase` (classes/interfaces) | `camelCase` (funções/vars) | `kebab-case` (arquivos)
- Sufixos obrigatórios: `.entity.ts` | `.use-case.ts` | `.repository.ts` | `.controller.ts` | `.module.ts` | `.dto.ts`
- Prefixo `I` para interfaces de ports: `IPatientRepository`, `ICreatePatientUseCase`
- Sem `console.log` em produção — use o `Logger` do NestJS (`@nestjs/common`)
- Importações: Node built-ins → libs externas → internas (`@odontoehtec/*`) → relativas

## Stack

| Camada           | Tecnologia                              |
| ---------------- | --------------------------------------- |
| Landing page     | Next.js 15, React 19, TypeScript        |
| Painel dentista  | Next.js 15, React 19, TypeScript        |
| API REST         | NestJS 11, TypeScript, class-validator  |
| Banco de dados   | PostgreSQL + Prisma 6                   |
| Tipos shared     | @odontoehtec/shared                     |
| Qualidade        | ESLint + SonarJS + Prettier + Husky     |

## Quality Gates
- **Pre-commit**: Husky + lint-staged — ESLint e Prettier em arquivos staged
- **Complexidade cognitiva**: máximo 15 (warn) — refatorar funções complexas
- **Funções duplicadas idênticas**: `error` — bloqueia commit
- **`any` explícito**: `warn` — documentar com eslint-disable e justificativa
- **Variáveis não usadas**: `error` — prefixar com `_` para ignorar intencionalmente
- **Prettier**: printWidth 100, singleQuote, trailingComma es5
- Rodar `pnpm lint` antes de abrir PR — CI rejeita PRs com erros de lint

## Processo de Desenvolvimento
- Adotar abordagem **spec-driven** para implementação de cada feature
- Antes de codar, definir escopo, requisitos, critérios de aceite e impactos técnicos
- Cada feature deve ter um plano próprio dentro de `docs/`
- Padrão sugerido: `docs/<nome-da-feature>.md`

## Padrões de Commit
Conventional Commits: `feat:` | `fix:` | `refactor:` | `docs:` | `test:` | `chore:`

## Variáveis de Ambiente
- `apps/odontoapi`: `DATABASE_URL` (PostgreSQL connection string), `PORT` (padrão 3333)
- `apps/odontoapp`: `NEXT_PUBLIC_API_URL` (URL da REST API)
- Nunca commitar `.env` — criar `.env.example` como referência sem valores reais
