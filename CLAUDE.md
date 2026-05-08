# OdontoEhTec — Claude Rules

## Projeto

SaaS odontológico para gestão de clínicas e pacientes: agendamento, prontuário, faturamento e relatórios.

## Monorepo

```
apps/landingpage  → Next.js 15 (App Router) — site público
apps/odontoapp   → Next.js 15 (App Router) — painel do dentista
apps/odontoapi   → NestJS 11 — REST API
packages/shared  → Tipos TypeScript e DTOs compartilhados
```

Package manager: **pnpm** | Orquestrador: **Turborepo**
Comandos raiz: `pnpm dev` | `pnpm build` | `pnpm lint` | `pnpm type-check`

## Arquitetura Hexagonal (odontoapi)

Dependências sempre apontam para dentro: `infrastructure → application → domain`.

```
domain/entities/             → Classes puras, sem decorators de framework
domain/ports/in/             → Interfaces Input Port (contratos de casos de uso)
domain/ports/out/            → Interfaces Output Port (contratos de repositórios)
domain/value-objects/        → Objetos de valor imutáveis
application/use-cases/       → Implementações dos Input Ports
infrastructure/adapters/in/  → @Controllers NestJS
infrastructure/adapters/out/ → Repositórios Prisma implementando Output Ports
infrastructure/config/       → @Modules NestJS
```

**Regras invioláveis:**

- `domain/` nunca importa de `application/` ou `infrastructure/`
- `application/` nunca importa de `infrastructure/`
- DI via interfaces (Output Ports), nunca via implementações diretas
- Controllers recebem/retornam DTOs — nunca expõem entidades de domínio
- Entidades de domínio sem decorators de framework

## Convenções de Código

- TypeScript `strict: true` — `any` exige comentário `eslint-disable` com justificativa
- Todas as funções públicas da API com retorno explicitamente tipado
- `PascalCase` (classes/interfaces) | `camelCase` (funções/vars) | `kebab-case` (arquivos)
- Sufixos obrigatórios: `.entity.ts` | `.use-case.ts` | `.repository.ts` | `.controller.ts` | `.module.ts` | `.dto.ts`
- Prefixo `I` em interfaces de ports: `IPatientRepository`, `ICreatePatientUseCase`
- Sem `console.log` em produção — usar `Logger` do NestJS (`@nestjs/common`)
- Importações: Node built-ins → libs externas → internas (`@odontoehtec/*`) → relativas
- `import type` obrigatório para importações de tipo puro

## Stack

| Camada          | Tecnologia                             |
| --------------- | -------------------------------------- |
| Landing page    | Next.js 15, React 19, TypeScript       |
| Painel dentista | Next.js 15, React 19, TypeScript       |
| API REST        | NestJS 11, TypeScript, class-validator |
| Banco de dados  | PostgreSQL + Prisma                    |
| Tipos shared    | @odontoehtec/shared                    |
| Qualidade       | ESLint + SonarJS + Prettier + Husky    |
| Testes API      | Jest + ts-jest + @nestjs/testing       |
| Testes Frontend | Vitest + Testing Library + jsdom       |

## Testes

- **odontoapi**: Jest — arquivos `*.spec.ts` dentro de `src/`, mockar Output Ports via `jest.fn()`
- **odontoapp / landingpage**: Vitest + React Testing Library — arquivos `*.spec.tsx` em `src/`
- **packages/shared**: Vitest — arquivos `*.spec.ts` junto ao código testado
- Comandos: `pnpm test` (todos) | `pnpm test:cov` (com cobertura) | `pnpm test:watch` (por package)
- Testes unitários focam em `application/use-cases/` e `domain/` — sem banco real, sem rede
- Nomear testes em português, descrevendo comportamento: `it('retorna erro quando paciente não existe')`

## Quality Gates

- **Pre-commit**: Husky + lint-staged — ESLint e Prettier nos arquivos staged
- **Complexidade cognitiva**: máximo 15 — refatorar funções que excedem
- **Funções duplicadas**: `error` — bloqueia commit
- **Variáveis não usadas**: `error` — prefixar com `_` para ignorar intencionalmente
- **Prettier**: `printWidth: 100`, `singleQuote: true`, `trailingComma: 'es5'`
- Rodar `pnpm lint` antes de abrir PR

## Processo de Desenvolvimento

- Abordagem **spec-driven**: definir escopo, requisitos e critérios de aceite antes de codar
- Cada feature com plano próprio em `docs/<nome-da-feature>.md`
- Conventional Commits: `feat:` | `fix:` | `refactor:` | `docs:` | `test:` | `chore:`

## Variáveis de Ambiente

- `odontoapi`: `DATABASE_URL` (PostgreSQL), `PORT` (padrão 3333)
- `odontoapp`: `NEXT_PUBLIC_API_URL` (URL da REST API)
- Nunca commitar `.env` — manter `.env.example` como referência sem valores reais
