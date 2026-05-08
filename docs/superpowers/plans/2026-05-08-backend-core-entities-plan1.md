# Backend Core Entities — Plan 1 of 3: Schema Foundation + Subscriber Module

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish the complete Prisma schema for all SaaS entities, implement the full domain layer (value objects, entities, ports), and deliver a working REST API for the Subscriber resource.

**Architecture:** Hexagonal architecture — `infrastructure → application → domain`. The Subscriber is the SaaS account holder who owns N Clinics. A Clinic is the multi-tenancy boundary; Professionals and Patients belong to a Clinic. This plan delivers the schema and the Subscriber module end-to-end; Plans 2 and 3 deliver Clinic, Professional, and Patient modules using the same patterns established here.

**Tech Stack:** NestJS 11, Prisma 7, PostgreSQL, TypeScript strict, class-validator, class-transformer, Jest + ts-jest

---

## File Structure

### Modified

- `apps/odontoapi/prisma/schema.prisma` — complete schema with Subscriber, Plan, Subscription, Clinic, Professional, Patient

### Created — Domain Layer

- `apps/odontoapi/src/domain/value-objects/email.value-object.ts`
- `apps/odontoapi/src/domain/value-objects/email.value-object.spec.ts`
- `apps/odontoapi/src/domain/value-objects/cpf.value-object.ts`
- `apps/odontoapi/src/domain/value-objects/cpf.value-object.spec.ts`
- `apps/odontoapi/src/domain/value-objects/cnpj.value-object.ts`
- `apps/odontoapi/src/domain/value-objects/cnpj.value-object.spec.ts`
- `apps/odontoapi/src/domain/value-objects/phone.value-object.ts`
- `apps/odontoapi/src/domain/value-objects/phone.value-object.spec.ts`
- `apps/odontoapi/src/domain/entities/subscriber.entity.ts`
- `apps/odontoapi/src/domain/entities/plan.entity.ts`
- `apps/odontoapi/src/domain/entities/subscription.entity.ts`
- `apps/odontoapi/src/domain/entities/clinic.entity.ts`
- `apps/odontoapi/src/domain/entities/professional.entity.ts`
- `apps/odontoapi/src/domain/entities/patient.entity.ts`

### Created — Ports (Output)

- `apps/odontoapi/src/domain/ports/out/subscriber.repository.ts` — interface + DI token

### Created — Ports (Input — Subscriber)

- `apps/odontoapi/src/domain/ports/in/subscriber/create-subscriber.use-case.ts`
- `apps/odontoapi/src/domain/ports/in/subscriber/find-subscriber-by-id.use-case.ts`
- `apps/odontoapi/src/domain/ports/in/subscriber/list-subscribers.use-case.ts`
- `apps/odontoapi/src/domain/ports/in/subscriber/update-subscriber.use-case.ts`
- `apps/odontoapi/src/domain/ports/in/subscriber/delete-subscriber.use-case.ts`

### Created — Application Layer (Subscriber)

- `apps/odontoapi/src/application/use-cases/subscriber/create-subscriber.use-case.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/create-subscriber.use-case.spec.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/find-subscriber-by-id.use-case.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/find-subscriber-by-id.use-case.spec.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/list-subscribers.use-case.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/list-subscribers.use-case.spec.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/update-subscriber.use-case.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/update-subscriber.use-case.spec.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/delete-subscriber.use-case.ts`
- `apps/odontoapi/src/application/use-cases/subscriber/delete-subscriber.use-case.spec.ts`

### Created — Infrastructure Layer (Subscriber)

- `apps/odontoapi/src/infrastructure/adapters/out/prisma.service.ts`
- `apps/odontoapi/src/infrastructure/adapters/out/prisma-subscriber.repository.ts`
- `apps/odontoapi/src/infrastructure/adapters/in/subscriber/create-subscriber.dto.ts`
- `apps/odontoapi/src/infrastructure/adapters/in/subscriber/update-subscriber.dto.ts`
- `apps/odontoapi/src/infrastructure/adapters/in/subscriber/subscriber.controller.ts`
- `apps/odontoapi/src/infrastructure/config/prisma.module.ts`
- `apps/odontoapi/src/infrastructure/config/subscriber.module.ts`

### Modified — Root

- `apps/odontoapi/src/app.module.ts`

---

## Task 1: Update Prisma Schema

**Files:**

- Modify: `apps/odontoapi/prisma/schema.prisma`

- [ ] **Step 1: Replace the entire schema.prisma content**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Subscriber {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  document  String   @unique
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  clinics Clinic[]

  @@map("subscribers")
}

model Plan {
  id          String   @id @default(cuid())
  name        String   @unique
  description String?
  price       Decimal  @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("plans")
}

model Clinic {
  id           String   @id @default(cuid())
  name         String
  cnpj         String   @unique
  phone        String?
  email        String?
  address      String?
  subscriberId String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  subscriber    Subscriber     @relation(fields: [subscriberId], references: [id], onDelete: Cascade)
  professionals Professional[]
  patients      Patient[]

  @@map("clinics")
}

model Professional {
  id        String           @id @default(cuid())
  name      String
  email     String           @unique
  cpf       String           @unique
  phone     String?
  role      ProfessionalRole @default(DENTIST)
  clinicId  String
  createdAt DateTime         @default(now())
  updatedAt DateTime         @updatedAt

  clinic Clinic @relation(fields: [clinicId], references: [id], onDelete: Cascade)

  @@map("professionals")
}

enum ProfessionalRole {
  DENTIST
  RECEPTIONIST
  ADMIN
}

model Patient {
  id        String    @id @default(cuid())
  name      String
  cpf       String
  birthDate DateTime?
  phone     String?
  email     String?
  clinicId  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  clinic Clinic @relation(fields: [clinicId], references: [id], onDelete: Cascade)

  @@unique([cpf, clinicId])
  @@map("patients")
}
```

- [ ] **Step 2: Commit the schema**

```bash
cd apps/odontoapi
git add prisma/schema.prisma
git commit -m "chore: define complete Prisma schema for SaaS core entities"
```

---

## Task 2: Run Initial Migration

**Files:**

- Creates: `apps/odontoapi/prisma/migrations/` (auto-generated)

- [ ] **Step 1: Ensure DATABASE_URL is set in .env**

Copy `.env.example` to `.env` if it doesn't exist:

```bash
cd apps/odontoapi
cp .env.example .env
# Edit .env and set a real DATABASE_URL pointing to your local PostgreSQL
```

- [ ] **Step 2: Generate and apply the migration**

```bash
cd apps/odontoapi
npx prisma migrate dev --name init-core-entities
```

Expected output: `The following migration(s) have been applied: 20260508xxxxxx_init_core_entities`

- [ ] **Step 3: Generate Prisma client**

```bash
npx prisma generate
```

Expected: `Generated Prisma Client`

- [ ] **Step 4: Commit the migration**

```bash
git add prisma/migrations/
git commit -m "chore: add initial migration for core entities"
```

---

## Task 3: Email Value Object

**Files:**

- Create: `apps/odontoapi/src/domain/value-objects/email.value-object.ts`
- Create: `apps/odontoapi/src/domain/value-objects/email.value-object.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/domain/value-objects/email.value-object.spec.ts`:

```typescript
import { Email } from './email.value-object';

describe('Email', () => {
  it('cria email válido e normaliza para minúsculas', () => {
    const email = Email.create('Contato@Clinica.COM');
    expect(email.toString()).toBe('contato@clinica.com');
  });

  it('lança erro para email sem @', () => {
    expect(() => Email.create('invalido.com')).toThrow('Email inválido');
  });

  it('lança erro para email sem domínio', () => {
    expect(() => Email.create('user@')).toThrow('Email inválido');
  });

  it('lança erro para string vazia', () => {
    expect(() => Email.create('')).toThrow('Email inválido');
  });

  it('retorna true para email válido via isValid', () => {
    expect(Email.isValid('user@example.com')).toBe(true);
  });

  it('retorna false para email inválido via isValid', () => {
    expect(Email.isValid('not-an-email')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
cd apps/odontoapi
pnpm test src/domain/value-objects/email.value-object.spec.ts
```

Expected: FAIL — `Cannot find module './email.value-object'`

- [ ] **Step 3: Implement the Email value object**

Create `apps/odontoapi/src/domain/value-objects/email.value-object.ts`:

```typescript
export class Email {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Email {
    const normalized = raw.toLowerCase().trim();
    if (!Email.isValid(normalized)) {
      throw new Error('Email inválido');
    }
    return new Email(normalized);
  }

  static isValid(raw: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim());
  }

  toString(): string {
    return this.value;
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/domain/value-objects/email.value-object.spec.ts
```

Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/domain/value-objects/email.value-object.ts src/domain/value-objects/email.value-object.spec.ts
git commit -m "feat: add Email value object with validation"
```

---

## Task 4: Cpf Value Object

**Files:**

- Create: `apps/odontoapi/src/domain/value-objects/cpf.value-object.ts`
- Create: `apps/odontoapi/src/domain/value-objects/cpf.value-object.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/domain/value-objects/cpf.value-object.spec.ts`:

```typescript
import { Cpf } from './cpf.value-object';

describe('Cpf', () => {
  it('cria CPF válido removendo formatação', () => {
    const cpf = Cpf.create('529.982.247-25');
    expect(cpf.toString()).toBe('52998224725');
  });

  it('retorna CPF formatado', () => {
    const cpf = Cpf.create('52998224725');
    expect(cpf.formatted()).toBe('529.982.247-25');
  });

  it('lança erro para CPF com todos os dígitos iguais', () => {
    expect(() => Cpf.create('111.111.111-11')).toThrow('CPF inválido');
  });

  it('lança erro para CPF com dígito verificador incorreto', () => {
    expect(() => Cpf.create('529.982.247-26')).toThrow('CPF inválido');
  });

  it('lança erro para CPF com menos de 11 dígitos', () => {
    expect(() => Cpf.create('1234567')).toThrow('CPF inválido');
  });

  it('retorna true para CPF válido via isValid', () => {
    expect(Cpf.isValid('52998224725')).toBe(true);
  });

  it('retorna false para CPF inválido via isValid', () => {
    expect(Cpf.isValid('00000000000')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/domain/value-objects/cpf.value-object.spec.ts
```

Expected: FAIL — `Cannot find module './cpf.value-object'`

- [ ] **Step 3: Implement Cpf value object**

Create `apps/odontoapi/src/domain/value-objects/cpf.value-object.ts`:

```typescript
export class Cpf {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Cpf {
    const digits = raw.replace(/\D/g, '');
    if (!Cpf.isValid(digits)) {
      throw new Error('CPF inválido');
    }
    return new Cpf(digits);
  }

  static isValid(raw: string): boolean {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1{10}$/.test(digits)) return false;

    const calcDigit = (slice: string): number => {
      const sum = slice
        .split('')
        .reduce((acc, d, i) => acc + Number(d) * (slice.length + 1 - i), 0);
      const rem = (sum * 10) % 11;
      return rem >= 10 ? 0 : rem;
    };

    const d1 = calcDigit(digits.slice(0, 9));
    if (d1 !== Number(digits[9])) return false;
    const d2 = calcDigit(digits.slice(0, 10));
    return d2 === Number(digits[10]);
  }

  toString(): string {
    return this.value;
  }

  formatted(): string {
    return this.value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/domain/value-objects/cpf.value-object.spec.ts
```

Expected: PASS — 7 tests

- [ ] **Step 5: Commit**

```bash
git add src/domain/value-objects/cpf.value-object.ts src/domain/value-objects/cpf.value-object.spec.ts
git commit -m "feat: add Cpf value object with Brazilian validation algorithm"
```

---

## Task 5: Cnpj Value Object

**Files:**

- Create: `apps/odontoapi/src/domain/value-objects/cnpj.value-object.ts`
- Create: `apps/odontoapi/src/domain/value-objects/cnpj.value-object.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/domain/value-objects/cnpj.value-object.spec.ts`:

```typescript
import { Cnpj } from './cnpj.value-object';

describe('Cnpj', () => {
  it('cria CNPJ válido removendo formatação', () => {
    const cnpj = Cnpj.create('11.222.333/0001-81');
    expect(cnpj.toString()).toBe('11222333000181');
  });

  it('retorna CNPJ formatado', () => {
    const cnpj = Cnpj.create('11222333000181');
    expect(cnpj.formatted()).toBe('11.222.333/0001-81');
  });

  it('lança erro para CNPJ com todos os dígitos iguais', () => {
    expect(() => Cnpj.create('00.000.000/0000-00')).toThrow('CNPJ inválido');
  });

  it('lança erro para CNPJ com dígito verificador incorreto', () => {
    expect(() => Cnpj.create('11.222.333/0001-82')).toThrow('CNPJ inválido');
  });

  it('lança erro para CNPJ com menos de 14 dígitos', () => {
    expect(() => Cnpj.create('1122233300018')).toThrow('CNPJ inválido');
  });

  it('retorna true para CNPJ válido via isValid', () => {
    expect(Cnpj.isValid('11222333000181')).toBe(true);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/domain/value-objects/cnpj.value-object.spec.ts
```

Expected: FAIL — `Cannot find module './cnpj.value-object'`

- [ ] **Step 3: Implement Cnpj value object**

Create `apps/odontoapi/src/domain/value-objects/cnpj.value-object.ts`:

```typescript
export class Cnpj {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Cnpj {
    const digits = raw.replace(/\D/g, '');
    if (!Cnpj.isValid(digits)) {
      throw new Error('CNPJ inválido');
    }
    return new Cnpj(digits);
  }

  static isValid(raw: string): boolean {
    const digits = raw.replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1{13}$/.test(digits)) return false;

    const calcDigit = (str: string, weights: number[]): number => {
      const sum = str.split('').reduce((acc, d, i) => acc + Number(d) * weights[i], 0);
      const rem = sum % 11;
      return rem < 2 ? 0 : 11 - rem;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    const d1 = calcDigit(digits.slice(0, 12), w1);
    if (d1 !== Number(digits[12])) return false;
    const d2 = calcDigit(digits.slice(0, 13), w2);
    return d2 === Number(digits[13]);
  }

  toString(): string {
    return this.value;
  }

  formatted(): string {
    return this.value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/domain/value-objects/cnpj.value-object.spec.ts
```

Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/domain/value-objects/cnpj.value-object.ts src/domain/value-objects/cnpj.value-object.spec.ts
git commit -m "feat: add Cnpj value object with Brazilian validation algorithm"
```

---

## Task 6: Phone Value Object

**Files:**

- Create: `apps/odontoapi/src/domain/value-objects/phone.value-object.ts`
- Create: `apps/odontoapi/src/domain/value-objects/phone.value-object.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/domain/value-objects/phone.value-object.spec.ts`:

```typescript
import { Phone } from './phone.value-object';

describe('Phone', () => {
  it('cria telefone fixo válido (10 dígitos)', () => {
    const phone = Phone.create('(11) 3333-4444');
    expect(phone.toString()).toBe('1133334444');
  });

  it('cria celular válido (11 dígitos)', () => {
    const phone = Phone.create('(11) 99999-8888');
    expect(phone.toString()).toBe('11999998888');
  });

  it('lança erro para telefone com menos de 10 dígitos', () => {
    expect(() => Phone.create('123456789')).toThrow('Telefone inválido');
  });

  it('lança erro para telefone com mais de 11 dígitos', () => {
    expect(() => Phone.create('119999988881')).toThrow('Telefone inválido');
  });

  it('retorna true para número válido via isValid', () => {
    expect(Phone.isValid('11999998888')).toBe(true);
  });

  it('retorna false para número inválido via isValid', () => {
    expect(Phone.isValid('123')).toBe(false);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/domain/value-objects/phone.value-object.spec.ts
```

Expected: FAIL — `Cannot find module './phone.value-object'`

- [ ] **Step 3: Implement Phone value object**

Create `apps/odontoapi/src/domain/value-objects/phone.value-object.ts`:

```typescript
export class Phone {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  static create(raw: string): Phone {
    const digits = raw.replace(/\D/g, '');
    if (!Phone.isValid(digits)) {
      throw new Error('Telefone inválido');
    }
    return new Phone(digits);
  }

  static isValid(raw: string): boolean {
    const digits = raw.replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  toString(): string {
    return this.value;
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/domain/value-objects/phone.value-object.spec.ts
```

Expected: PASS — 6 tests

- [ ] **Step 5: Commit**

```bash
git add src/domain/value-objects/phone.value-object.ts src/domain/value-objects/phone.value-object.spec.ts
git commit -m "feat: add Phone value object"
```

---

## Task 7: Domain Entities

**Files:**

- Create: `apps/odontoapi/src/domain/entities/subscriber.entity.ts`
- Create: `apps/odontoapi/src/domain/entities/plan.entity.ts`
- Create: `apps/odontoapi/src/domain/entities/subscription.entity.ts`
- Create: `apps/odontoapi/src/domain/entities/clinic.entity.ts`
- Create: `apps/odontoapi/src/domain/entities/professional.entity.ts`
- Create: `apps/odontoapi/src/domain/entities/patient.entity.ts`

> Pure TypeScript classes — no NestJS/Prisma decorators.

- [ ] **Step 1: Create subscriber.entity.ts**

```typescript
export class Subscriber {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly document: string,
    public readonly phone: string | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

- [ ] **Step 2: Create plan.entity.ts**

```typescript
import type { Decimal } from '@prisma/client/runtime/library';

export class Plan {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string | null,
    public readonly price: Decimal,
    public readonly isActive: boolean,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

- [ ] **Step 3: Create subscription.entity.ts**

```typescript
export type SubscriptionStatus = 'TRIAL' | 'ACTIVE' | 'INACTIVE' | 'CANCELLED';

export class Subscription {
  constructor(
    public readonly id: string,
    public readonly subscriberId: string,
    public readonly planId: string,
    public readonly status: SubscriptionStatus,
    public readonly startDate: Date,
    public readonly endDate: Date | null,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

- [ ] **Step 4: Create clinic.entity.ts**

```typescript
export class Clinic {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly cnpj: string,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly address: string | null,
    public readonly subscriberId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

- [ ] **Step 5: Create professional.entity.ts**

```typescript
export type ProfessionalRole = 'DENTIST' | 'RECEPTIONIST' | 'ADMIN';

export class Professional {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly cpf: string,
    public readonly phone: string | null,
    public readonly role: ProfessionalRole,
    public readonly clinicId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

- [ ] **Step 6: Create patient.entity.ts**

```typescript
export class Patient {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly cpf: string,
    public readonly birthDate: Date | null,
    public readonly phone: string | null,
    public readonly email: string | null,
    public readonly clinicId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date
  ) {}
}
```

- [ ] **Step 7: Commit all entities**

```bash
cd apps/odontoapi
git add src/domain/entities/
git commit -m "feat: add domain entities for all core SaaS models"
```

---

## Task 8: Subscriber Output Port (Repository Interface)

**Files:**

- Create: `apps/odontoapi/src/domain/ports/out/subscriber.repository.ts`

- [ ] **Step 1: Create the interface and DI token**

```typescript
import type { Subscriber } from '../../entities/subscriber.entity';

export const SUBSCRIBER_REPOSITORY = Symbol('ISubscriberRepository');

export interface CreateSubscriberData {
  name: string;
  email: string;
  document: string;
  phone: string | null;
}

export interface UpdateSubscriberData {
  name?: string;
  phone?: string | null;
}

export interface SubscriberPage {
  items: Subscriber[];
  total: number;
}

export interface ISubscriberRepository {
  create(data: CreateSubscriberData): Promise<Subscriber>;
  findById(id: string): Promise<Subscriber | null>;
  findByEmail(email: string): Promise<Subscriber | null>;
  findByDocument(document: string): Promise<Subscriber | null>;
  findAll(page: number, limit: number): Promise<SubscriberPage>;
  update(id: string, data: UpdateSubscriberData): Promise<Subscriber>;
  delete(id: string): Promise<void>;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/domain/ports/out/subscriber.repository.ts
git commit -m "feat: add ISubscriberRepository output port"
```

---

## Task 9: Subscriber Input Ports (Use Case Interfaces)

**Files:**

- Create: `apps/odontoapi/src/domain/ports/in/subscriber/create-subscriber.use-case.ts`
- Create: `apps/odontoapi/src/domain/ports/in/subscriber/find-subscriber-by-id.use-case.ts`
- Create: `apps/odontoapi/src/domain/ports/in/subscriber/list-subscribers.use-case.ts`
- Create: `apps/odontoapi/src/domain/ports/in/subscriber/update-subscriber.use-case.ts`
- Create: `apps/odontoapi/src/domain/ports/in/subscriber/delete-subscriber.use-case.ts`

- [ ] **Step 1: Create create-subscriber.use-case.ts**

```typescript
export const CREATE_SUBSCRIBER_USE_CASE = Symbol('ICreateSubscriberUseCase');

export interface CreateSubscriberInput {
  name: string;
  email: string;
  document: string;
  phone?: string;
}

export interface CreateSubscriberOutput {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriberUseCase {
  execute(input: CreateSubscriberInput): Promise<CreateSubscriberOutput>;
}
```

- [ ] **Step 2: Create find-subscriber-by-id.use-case.ts**

```typescript
export const FIND_SUBSCRIBER_BY_ID_USE_CASE = Symbol('IFindSubscriberByIdUseCase');

export interface FindSubscriberByIdInput {
  id: string;
}

export interface FindSubscriberByIdOutput {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindSubscriberByIdUseCase {
  execute(input: FindSubscriberByIdInput): Promise<FindSubscriberByIdOutput>;
}
```

- [ ] **Step 3: Create list-subscribers.use-case.ts**

```typescript
export const LIST_SUBSCRIBERS_USE_CASE = Symbol('IListSubscribersUseCase');

export interface ListSubscribersInput {
  page: number;
  limit: number;
}

export interface SubscriberItem {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListSubscribersOutput {
  items: SubscriberItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListSubscribersUseCase {
  execute(input: ListSubscribersInput): Promise<ListSubscribersOutput>;
}
```

- [ ] **Step 4: Create update-subscriber.use-case.ts**

```typescript
export const UPDATE_SUBSCRIBER_USE_CASE = Symbol('IUpdateSubscriberUseCase');

export interface UpdateSubscriberInput {
  id: string;
  name?: string;
  phone?: string | null;
}

export interface UpdateSubscriberOutput {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateSubscriberUseCase {
  execute(input: UpdateSubscriberInput): Promise<UpdateSubscriberOutput>;
}
```

- [ ] **Step 5: Create delete-subscriber.use-case.ts**

```typescript
export const DELETE_SUBSCRIBER_USE_CASE = Symbol('IDeleteSubscriberUseCase');

export interface DeleteSubscriberInput {
  id: string;
}

export interface IDeleteSubscriberUseCase {
  execute(input: DeleteSubscriberInput): Promise<void>;
}
```

- [ ] **Step 6: Commit**

```bash
git add src/domain/ports/in/subscriber/
git commit -m "feat: add Subscriber input ports (use case interfaces)"
```

---

## Task 10: PrismaService and PrismaModule

**Files:**

- Create: `apps/odontoapi/src/infrastructure/adapters/out/prisma.service.ts`
- Create: `apps/odontoapi/src/infrastructure/config/prisma.module.ts`

- [ ] **Step 1: Create PrismaService**

Create `apps/odontoapi/src/infrastructure/adapters/out/prisma.service.ts`:

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit(): Promise<void> {
    await this.$connect();
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
```

- [ ] **Step 2: Create PrismaModule**

Create `apps/odontoapi/src/infrastructure/config/prisma.module.ts`:

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from '../adapters/out/prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

- [ ] **Step 3: Commit**

```bash
git add src/infrastructure/adapters/out/prisma.service.ts src/infrastructure/config/prisma.module.ts
git commit -m "feat: add PrismaService and global PrismaModule"
```

---

## Task 11: CreateSubscriber Use Case (TDD)

**Files:**

- Create: `apps/odontoapi/src/application/use-cases/subscriber/create-subscriber.use-case.ts`
- Create: `apps/odontoapi/src/application/use-cases/subscriber/create-subscriber.use-case.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/application/use-cases/subscriber/create-subscriber.use-case.spec.ts`:

```typescript
import { ConflictException } from '@nestjs/common';
import { CreateSubscriberUseCase } from './create-subscriber.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('CreateSubscriberUseCase', () => {
  let useCase: CreateSubscriberUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new CreateSubscriberUseCase(repository);
  });

  it('cria assinante com dados válidos', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: 'sub_1',
      name: 'Clínica Dental',
      email: 'contato@clinica.com',
      document: '11222333000181',
      phone: '11999999999',
      createdAt: now,
      updatedAt: now,
    });

    const result = await useCase.execute({
      name: 'Clínica Dental',
      email: 'contato@clinica.com',
      document: '11.222.333/0001-81',
      phone: '11999999999',
    });

    expect(result.id).toBe('sub_1');
    expect(result.email).toBe('contato@clinica.com');
    expect(repository.create).toHaveBeenCalledWith({
      name: 'Clínica Dental',
      email: 'contato@clinica.com',
      document: '11222333000181',
      phone: '11999999999',
    });
  });

  it('normaliza email para minúsculas antes de criar', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue(null);
    repository.create.mockResolvedValue({
      id: 'sub_2',
      name: 'Clínica',
      email: 'contato@clinica.com',
      document: '11222333000181',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    await useCase.execute({
      name: 'Clínica',
      email: 'CONTATO@CLINICA.COM',
      document: '11222333000181',
    });

    expect(repository.create).toHaveBeenCalledWith(
      expect.objectContaining({ email: 'contato@clinica.com' })
    );
  });

  it('lança ConflictException quando email já cadastrado', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue({
      id: 'existing',
      name: 'Outro',
      email: 'contato@clinica.com',
      document: '99',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      useCase.execute({ name: 'Nova', email: 'contato@clinica.com', document: '22333444000192' })
    ).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });

  it('lança ConflictException quando documento já cadastrado', async () => {
    const now = new Date();
    repository.findByEmail.mockResolvedValue(null);
    repository.findByDocument.mockResolvedValue({
      id: 'existing',
      name: 'Outro',
      email: 'outro@clinica.com',
      document: '11222333000181',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    await expect(
      useCase.execute({ name: 'Nova', email: 'nova@clinica.com', document: '11222333000181' })
    ).rejects.toThrow(ConflictException);
    expect(repository.create).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
cd apps/odontoapi
pnpm test src/application/use-cases/subscriber/create-subscriber.use-case.spec.ts
```

Expected: FAIL — `Cannot find module './create-subscriber.use-case'`

- [ ] **Step 3: Implement the use case**

Create `apps/odontoapi/src/application/use-cases/subscriber/create-subscriber.use-case.ts`:

```typescript
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  ICreateSubscriberUseCase,
  CreateSubscriberInput,
  CreateSubscriberOutput,
} from '../../../domain/ports/in/subscriber/create-subscriber.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class CreateSubscriberUseCase implements ICreateSubscriberUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: CreateSubscriberInput): Promise<CreateSubscriberOutput> {
    const emailNormalized = input.email.toLowerCase().trim();
    const documentDigits = input.document.replace(/\D/g, '');

    const [byEmail, byDocument] = await Promise.all([
      this.subscriberRepository.findByEmail(emailNormalized),
      this.subscriberRepository.findByDocument(documentDigits),
    ]);

    if (byEmail) throw new ConflictException('Email já cadastrado');
    if (byDocument) throw new ConflictException('Documento já cadastrado');

    const subscriber = await this.subscriberRepository.create({
      name: input.name,
      email: emailNormalized,
      document: documentDigits,
      phone: input.phone ?? null,
    });

    return {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      document: subscriber.document,
      phone: subscriber.phone,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/application/use-cases/subscriber/create-subscriber.use-case.spec.ts
```

Expected: PASS — 4 tests

- [ ] **Step 5: Commit**

```bash
git add src/application/use-cases/subscriber/create-subscriber.use-case.ts \
        src/application/use-cases/subscriber/create-subscriber.use-case.spec.ts
git commit -m "feat: add CreateSubscriberUseCase with duplicate validation"
```

---

## Task 12: FindSubscriberById Use Case (TDD)

**Files:**

- Create: `apps/odontoapi/src/application/use-cases/subscriber/find-subscriber-by-id.use-case.ts`
- Create: `apps/odontoapi/src/application/use-cases/subscriber/find-subscriber-by-id.use-case.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/application/use-cases/subscriber/find-subscriber-by-id.use-case.spec.ts`:

```typescript
import { NotFoundException } from '@nestjs/common';
import { FindSubscriberByIdUseCase } from './find-subscriber-by-id.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('FindSubscriberByIdUseCase', () => {
  let useCase: FindSubscriberByIdUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new FindSubscriberByIdUseCase(repository);
  });

  it('retorna assinante quando encontrado', async () => {
    const now = new Date();
    repository.findById.mockResolvedValue({
      id: 'sub_1',
      name: 'Clínica Dental',
      email: 'contato@clinica.com',
      document: '11222333000181',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });

    const result = await useCase.execute({ id: 'sub_1' });

    expect(result.id).toBe('sub_1');
    expect(result.name).toBe('Clínica Dental');
  });

  it('lança NotFoundException quando assinante não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'not-found' })).rejects.toThrow(NotFoundException);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/application/use-cases/subscriber/find-subscriber-by-id.use-case.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Implement the use case**

Create `apps/odontoapi/src/application/use-cases/subscriber/find-subscriber-by-id.use-case.ts`:

```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindSubscriberByIdUseCase,
  FindSubscriberByIdInput,
  FindSubscriberByIdOutput,
} from '../../../domain/ports/in/subscriber/find-subscriber-by-id.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class FindSubscriberByIdUseCase implements IFindSubscriberByIdUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: FindSubscriberByIdInput): Promise<FindSubscriberByIdOutput> {
    const subscriber = await this.subscriberRepository.findById(input.id);
    if (!subscriber) throw new NotFoundException('Assinante não encontrado');

    return {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      document: subscriber.document,
      phone: subscriber.phone,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/application/use-cases/subscriber/find-subscriber-by-id.use-case.spec.ts
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/application/use-cases/subscriber/find-subscriber-by-id.use-case.ts \
        src/application/use-cases/subscriber/find-subscriber-by-id.use-case.spec.ts
git commit -m "feat: add FindSubscriberByIdUseCase"
```

---

## Task 13: ListSubscribers Use Case (TDD)

**Files:**

- Create: `apps/odontoapi/src/application/use-cases/subscriber/list-subscribers.use-case.ts`
- Create: `apps/odontoapi/src/application/use-cases/subscriber/list-subscribers.use-case.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/application/use-cases/subscriber/list-subscribers.use-case.spec.ts`:

```typescript
import { ListSubscribersUseCase } from './list-subscribers.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ListSubscribersUseCase', () => {
  let useCase: ListSubscribersUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new ListSubscribersUseCase(repository);
  });

  it('retorna página de assinantes com totalPages calculado', async () => {
    const now = new Date();
    repository.findAll.mockResolvedValue({
      items: [
        {
          id: 's1',
          name: 'A',
          email: 'a@a.com',
          document: '1',
          phone: null,
          createdAt: now,
          updatedAt: now,
        },
        {
          id: 's2',
          name: 'B',
          email: 'b@b.com',
          document: '2',
          phone: null,
          createdAt: now,
          updatedAt: now,
        },
      ],
      total: 25,
    });

    const result = await useCase.execute({ page: 2, limit: 10 });

    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(25);
    expect(result.totalPages).toBe(3);
    expect(result.page).toBe(2);
    expect(repository.findAll).toHaveBeenCalledWith(2, 10);
  });

  it('retorna lista vazia quando não há assinantes', async () => {
    repository.findAll.mockResolvedValue({ items: [], total: 0 });

    const result = await useCase.execute({ page: 1, limit: 10 });

    expect(result.items).toHaveLength(0);
    expect(result.totalPages).toBe(0);
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/application/use-cases/subscriber/list-subscribers.use-case.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Implement the use case**

Create `apps/odontoapi/src/application/use-cases/subscriber/list-subscribers.use-case.ts`:

```typescript
import { Inject, Injectable } from '@nestjs/common';
import type {
  IListSubscribersUseCase,
  ListSubscribersInput,
  ListSubscribersOutput,
} from '../../../domain/ports/in/subscriber/list-subscribers.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class ListSubscribersUseCase implements IListSubscribersUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: ListSubscribersInput): Promise<ListSubscribersOutput> {
    const { items, total } = await this.subscriberRepository.findAll(input.page, input.limit);
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        document: s.document,
        phone: s.phone,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/application/use-cases/subscriber/list-subscribers.use-case.spec.ts
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/application/use-cases/subscriber/list-subscribers.use-case.ts \
        src/application/use-cases/subscriber/list-subscribers.use-case.spec.ts
git commit -m "feat: add ListSubscribersUseCase with pagination"
```

---

## Task 14: UpdateSubscriber Use Case (TDD)

**Files:**

- Create: `apps/odontoapi/src/application/use-cases/subscriber/update-subscriber.use-case.ts`
- Create: `apps/odontoapi/src/application/use-cases/subscriber/update-subscriber.use-case.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/application/use-cases/subscriber/update-subscriber.use-case.spec.ts`:

```typescript
import { NotFoundException } from '@nestjs/common';
import { UpdateSubscriberUseCase } from './update-subscriber.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('UpdateSubscriberUseCase', () => {
  let useCase: UpdateSubscriberUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new UpdateSubscriberUseCase(repository);
  });

  it('atualiza assinante existente', async () => {
    const now = new Date();
    const existing = {
      id: 'sub_1',
      name: 'Antigo',
      email: 'a@a.com',
      document: '1',
      phone: null,
      createdAt: now,
      updatedAt: now,
    };
    repository.findById.mockResolvedValue(existing);
    repository.update.mockResolvedValue({ ...existing, name: 'Novo Nome' });

    const result = await useCase.execute({ id: 'sub_1', name: 'Novo Nome' });

    expect(result.name).toBe('Novo Nome');
    expect(repository.update).toHaveBeenCalledWith('sub_1', {
      name: 'Novo Nome',
      phone: undefined,
    });
  });

  it('lança NotFoundException quando assinante não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'x', name: 'Nome' })).rejects.toThrow(NotFoundException);
    expect(repository.update).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/application/use-cases/subscriber/update-subscriber.use-case.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Implement the use case**

Create `apps/odontoapi/src/application/use-cases/subscriber/update-subscriber.use-case.ts`:

```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdateSubscriberUseCase,
  UpdateSubscriberInput,
  UpdateSubscriberOutput,
} from '../../../domain/ports/in/subscriber/update-subscriber.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class UpdateSubscriberUseCase implements IUpdateSubscriberUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: UpdateSubscriberInput): Promise<UpdateSubscriberOutput> {
    const existing = await this.subscriberRepository.findById(input.id);
    if (!existing) throw new NotFoundException('Assinante não encontrado');

    const updated = await this.subscriberRepository.update(input.id, {
      name: input.name,
      phone: input.phone,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      document: updated.document,
      phone: updated.phone,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/application/use-cases/subscriber/update-subscriber.use-case.spec.ts
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/application/use-cases/subscriber/update-subscriber.use-case.ts \
        src/application/use-cases/subscriber/update-subscriber.use-case.spec.ts
git commit -m "feat: add UpdateSubscriberUseCase"
```

---

## Task 15: DeleteSubscriber Use Case (TDD)

**Files:**

- Create: `apps/odontoapi/src/application/use-cases/subscriber/delete-subscriber.use-case.ts`
- Create: `apps/odontoapi/src/application/use-cases/subscriber/delete-subscriber.use-case.spec.ts`

- [ ] **Step 1: Write the failing test**

Create `apps/odontoapi/src/application/use-cases/subscriber/delete-subscriber.use-case.spec.ts`:

```typescript
import { NotFoundException } from '@nestjs/common';
import { DeleteSubscriberUseCase } from './delete-subscriber.use-case';
import type { ISubscriberRepository } from '../../../domain/ports/out/subscriber.repository';

const makeRepository = (): jest.Mocked<ISubscriberRepository> => ({
  create: jest.fn(),
  findById: jest.fn(),
  findByEmail: jest.fn(),
  findByDocument: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('DeleteSubscriberUseCase', () => {
  let useCase: DeleteSubscriberUseCase;
  let repository: jest.Mocked<ISubscriberRepository>;

  beforeEach(() => {
    repository = makeRepository();
    useCase = new DeleteSubscriberUseCase(repository);
  });

  it('deleta assinante existente', async () => {
    const now = new Date();
    repository.findById.mockResolvedValue({
      id: 'sub_1',
      name: 'A',
      email: 'a@a.com',
      document: '1',
      phone: null,
      createdAt: now,
      updatedAt: now,
    });
    repository.delete.mockResolvedValue();

    await expect(useCase.execute({ id: 'sub_1' })).resolves.toBeUndefined();
    expect(repository.delete).toHaveBeenCalledWith('sub_1');
  });

  it('lança NotFoundException quando assinante não existe', async () => {
    repository.findById.mockResolvedValue(null);

    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundException);
    expect(repository.delete).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test and confirm it fails**

```bash
pnpm test src/application/use-cases/subscriber/delete-subscriber.use-case.spec.ts
```

Expected: FAIL

- [ ] **Step 3: Implement the use case**

Create `apps/odontoapi/src/application/use-cases/subscriber/delete-subscriber.use-case.ts`:

```typescript
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeleteSubscriberUseCase,
  DeleteSubscriberInput,
} from '../../../domain/ports/in/subscriber/delete-subscriber.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class DeleteSubscriberUseCase implements IDeleteSubscriberUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: DeleteSubscriberInput): Promise<void> {
    const existing = await this.subscriberRepository.findById(input.id);
    if (!existing) throw new NotFoundException('Assinante não encontrado');
    await this.subscriberRepository.delete(input.id);
  }
}
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
pnpm test src/application/use-cases/subscriber/delete-subscriber.use-case.spec.ts
```

Expected: PASS — 2 tests

- [ ] **Step 5: Commit**

```bash
git add src/application/use-cases/subscriber/delete-subscriber.use-case.ts \
        src/application/use-cases/subscriber/delete-subscriber.use-case.spec.ts
git commit -m "feat: add DeleteSubscriberUseCase"
```

---

## Task 16: PrismaSubscriberRepository

**Files:**

- Create: `apps/odontoapi/src/infrastructure/adapters/out/prisma-subscriber.repository.ts`

- [ ] **Step 1: Create the Prisma repository**

Create `apps/odontoapi/src/infrastructure/adapters/out/prisma-subscriber.repository.ts`:

```typescript
import { Injectable } from '@nestjs/common';
import type {
  ISubscriberRepository,
  CreateSubscriberData,
  UpdateSubscriberData,
  SubscriberPage,
} from '../../../domain/ports/out/subscriber.repository';
import type { Subscriber } from '../../../domain/entities/subscriber.entity';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaSubscriberRepository implements ISubscriberRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateSubscriberData): Promise<Subscriber> {
    return this.prisma.subscriber.create({ data });
  }

  async findById(id: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { email } });
  }

  async findByDocument(document: string): Promise<Subscriber | null> {
    return this.prisma.subscriber.findUnique({ where: { document } });
  }

  async findAll(page: number, limit: number): Promise<SubscriberPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.subscriber.findMany({ skip, take: limit, orderBy: { createdAt: 'desc' } }),
      this.prisma.subscriber.count(),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdateSubscriberData): Promise<Subscriber> {
    return this.prisma.subscriber.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.subscriber.delete({ where: { id } });
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/infrastructure/adapters/out/prisma-subscriber.repository.ts
git commit -m "feat: add PrismaSubscriberRepository"
```

---

## Task 17: SubscriberController and DTOs

**Files:**

- Create: `apps/odontoapi/src/infrastructure/adapters/in/subscriber/create-subscriber.dto.ts`
- Create: `apps/odontoapi/src/infrastructure/adapters/in/subscriber/update-subscriber.dto.ts`
- Create: `apps/odontoapi/src/infrastructure/adapters/in/subscriber/subscriber.controller.ts`

- [ ] **Step 1: Create CreateSubscriberDto**

Create `apps/odontoapi/src/infrastructure/adapters/in/subscriber/create-subscriber.dto.ts`:

```typescript
import { IsEmail, IsNotEmpty, IsOptional, IsString, Length, Matches } from 'class-validator';

export class CreateSubscriberDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\d{11}$|^\d{14}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/, {
    message: 'document must be a valid CPF or CNPJ',
  })
  document!: string;

  @IsOptional()
  @IsString()
  @Length(10, 11)
  phone?: string;
}
```

- [ ] **Step 2: Create UpdateSubscriberDto**

Create `apps/odontoapi/src/infrastructure/adapters/in/subscriber/update-subscriber.dto.ts`:

```typescript
import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateSubscriberDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  @Length(10, 11)
  phone?: string | null;
}
```

- [ ] **Step 3: Create SubscriberController**

Create `apps/odontoapi/src/infrastructure/adapters/in/subscriber/subscriber.controller.ts`:

```typescript
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { ApiResponse } from '@odontoehtec/shared';
import { CreateSubscriberDto } from './create-subscriber.dto';
import { UpdateSubscriberDto } from './update-subscriber.dto';
import {
  CREATE_SUBSCRIBER_USE_CASE,
  type ICreateSubscriberUseCase,
  type CreateSubscriberOutput,
} from '../../../../domain/ports/in/subscriber/create-subscriber.use-case';
import {
  FIND_SUBSCRIBER_BY_ID_USE_CASE,
  type IFindSubscriberByIdUseCase,
  type FindSubscriberByIdOutput,
} from '../../../../domain/ports/in/subscriber/find-subscriber-by-id.use-case';
import {
  LIST_SUBSCRIBERS_USE_CASE,
  type IListSubscribersUseCase,
  type ListSubscribersOutput,
} from '../../../../domain/ports/in/subscriber/list-subscribers.use-case';
import {
  UPDATE_SUBSCRIBER_USE_CASE,
  type IUpdateSubscriberUseCase,
  type UpdateSubscriberOutput,
} from '../../../../domain/ports/in/subscriber/update-subscriber.use-case';
import {
  DELETE_SUBSCRIBER_USE_CASE,
  type IDeleteSubscriberUseCase,
} from '../../../../domain/ports/in/subscriber/delete-subscriber.use-case';

@Controller('subscribers')
export class SubscriberController {
  constructor(
    @Inject(CREATE_SUBSCRIBER_USE_CASE)
    private readonly createSubscriber: ICreateSubscriberUseCase,
    @Inject(FIND_SUBSCRIBER_BY_ID_USE_CASE)
    private readonly findSubscriberById: IFindSubscriberByIdUseCase,
    @Inject(LIST_SUBSCRIBERS_USE_CASE)
    private readonly listSubscribers: IListSubscribersUseCase,
    @Inject(UPDATE_SUBSCRIBER_USE_CASE)
    private readonly updateSubscriber: IUpdateSubscriberUseCase,
    @Inject(DELETE_SUBSCRIBER_USE_CASE)
    private readonly deleteSubscriber: IDeleteSubscriberUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateSubscriberDto): Promise<ApiResponse<CreateSubscriberOutput>> {
    const data = await this.createSubscriber.execute(dto);
    return { data, message: 'Assinante criado com sucesso' };
  }

  @Get()
  async list(
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListSubscribersOutput>> {
    const data = await this.listSubscribers.execute({
      page: Number(page),
      limit: Number(limit),
    });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindSubscriberByIdOutput>> {
    const data = await this.findSubscriberById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateSubscriberDto
  ): Promise<ApiResponse<UpdateSubscriberOutput>> {
    const data = await this.updateSubscriber.execute({ id, ...dto });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteSubscriber.execute({ id });
  }
}
```

- [ ] **Step 4: Commit**

```bash
git add src/infrastructure/adapters/in/subscriber/
git commit -m "feat: add SubscriberController and DTOs"
```

---

## Task 18: SubscriberModule and Wire AppModule

**Files:**

- Create: `apps/odontoapi/src/infrastructure/config/subscriber.module.ts`
- Modify: `apps/odontoapi/src/app.module.ts`

- [ ] **Step 1: Create SubscriberModule**

Create `apps/odontoapi/src/infrastructure/config/subscriber.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { SUBSCRIBER_REPOSITORY } from '../../domain/ports/out/subscriber.repository';
import { CREATE_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/subscriber/create-subscriber.use-case';
import { FIND_SUBSCRIBER_BY_ID_USE_CASE } from '../../domain/ports/in/subscriber/find-subscriber-by-id.use-case';
import { LIST_SUBSCRIBERS_USE_CASE } from '../../domain/ports/in/subscriber/list-subscribers.use-case';
import { UPDATE_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/subscriber/update-subscriber.use-case';
import { DELETE_SUBSCRIBER_USE_CASE } from '../../domain/ports/in/subscriber/delete-subscriber.use-case';
import { PrismaSubscriberRepository } from '../adapters/out/prisma-subscriber.repository';
import { CreateSubscriberUseCase } from '../../application/use-cases/subscriber/create-subscriber.use-case';
import { FindSubscriberByIdUseCase } from '../../application/use-cases/subscriber/find-subscriber-by-id.use-case';
import { ListSubscribersUseCase } from '../../application/use-cases/subscriber/list-subscribers.use-case';
import { UpdateSubscriberUseCase } from '../../application/use-cases/subscriber/update-subscriber.use-case';
import { DeleteSubscriberUseCase } from '../../application/use-cases/subscriber/delete-subscriber.use-case';
import { SubscriberController } from '../adapters/in/subscriber/subscriber.controller';

@Module({
  providers: [
    { provide: SUBSCRIBER_REPOSITORY, useClass: PrismaSubscriberRepository },
    { provide: CREATE_SUBSCRIBER_USE_CASE, useClass: CreateSubscriberUseCase },
    { provide: FIND_SUBSCRIBER_BY_ID_USE_CASE, useClass: FindSubscriberByIdUseCase },
    { provide: LIST_SUBSCRIBERS_USE_CASE, useClass: ListSubscribersUseCase },
    { provide: UPDATE_SUBSCRIBER_USE_CASE, useClass: UpdateSubscriberUseCase },
    { provide: DELETE_SUBSCRIBER_USE_CASE, useClass: DeleteSubscriberUseCase },
  ],
  controllers: [SubscriberController],
})
export class SubscriberModule {}
```

- [ ] **Step 2: Update AppModule**

Replace content of `apps/odontoapi/src/app.module.ts`:

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from './infrastructure/config/prisma.module';
import { SubscriberModule } from './infrastructure/config/subscriber.module';

@Module({
  imports: [PrismaModule, SubscriberModule],
})
export class AppModule {}
```

- [ ] **Step 3: Run all tests to confirm nothing broke**

```bash
cd apps/odontoapi
pnpm test
```

Expected: All use case specs PASS. Coverage should be above thresholds for the subscriber module.

- [ ] **Step 4: Run lint and type-check**

```bash
cd /path/to/monorepo-root
pnpm lint
pnpm type-check
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
cd apps/odontoapi
git add src/infrastructure/config/subscriber.module.ts src/app.module.ts
git commit -m "feat: wire SubscriberModule into AppModule — Subscriber CRUD API ready"
```

---

## Self-Review

**Spec coverage:**

- [x] Subscriber entity with document (CPF/CNPJ), email, name, phone
- [x] Multi-model Prisma schema: Subscriber, Plan, Clinic, Professional, Patient
- [x] CPF/CNPJ/Email/Phone value objects with Brazilian validation rules
- [x] Hexagonal architecture: pure domain, application use cases, infrastructure adapters
- [x] Full CRUD API for Subscriber: POST, GET, GET/:id, PUT/:id, DELETE/:id
- [x] Interface-based DI via Symbol tokens
- [x] Controllers return DTOs, never domain entities
- [x] Test names in Portuguese describing behavior
- [x] Mocked Output Ports via `jest.fn()` in unit tests

**Gaps / Follow-on plans:**

- Clinic, Professional, Patient CRUD → **Plan 2 and Plan 3**
- Plan/Subscription management (billing) → separate feature plan
- Authentication (JWT) → separate feature plan
- Multi-tenancy guard (extract clinicId from JWT) → separate feature plan

**Type consistency check:**

- `ISubscriberRepository` used consistently in ports, use cases, and repository
- DI tokens (`SUBSCRIBER_REPOSITORY`, etc.) defined in port files and imported in module
- `CreateSubscriberOutput` / `FindSubscriberByIdOutput` / `UpdateSubscriberOutput` return identical shape — consistent across use cases ✓
- `SubscriberController` injects tokens matching those provided in `SubscriberModule` ✓

---

## Next Steps

**Plan 2 of 3** (`2026-05-08-backend-core-entities-plan2.md`): Clinic Module — full CRUD with `subscriberId` ownership and `clinicId` as the multi-tenancy root. Nested routes: `GET /clinics/:clinicId/...`

**Plan 3 of 3** (`2026-05-08-backend-core-entities-plan3.md`): Professional and Patient Modules — both scoped under `/clinics/:clinicId/professionals` and `/clinics/:clinicId/patients`, enforcing clinic-level multi-tenancy at the route level.
