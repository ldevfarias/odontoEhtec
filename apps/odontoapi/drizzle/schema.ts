import { randomUUID } from 'crypto';
import { relations } from 'drizzle-orm';
import {
  boolean,
  index,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  numeric,
  unique,
  json,
} from 'drizzle-orm/pg-core';

// ─── Enums ───────────────────────────────────────────────────────────────────

export const professionalRoleEnum = pgEnum('professional_role', [
  'DENTIST',
  'RECEPTIONIST',
  'ASSISTANT',
]);

export const professionalStatusEnum = pgEnum('professional_status', [
  'INVITED',
  'ACTIVE',
  'INACTIVE',
]);

export const userTypeEnum = pgEnum('user_type', ['SUBSCRIBER', 'PROFESSIONAL']);

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'TRIAL',
  'ACTIVE',
  'INACTIVE',
  'CANCELLED',
]);

// ─── Tables ──────────────────────────────────────────────────────────────────

export const subscribers = pgTable('subscribers', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  document: text('document').notNull().unique(),
  phone: text('phone'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const plans = pgTable('plans', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull().unique(),
  description: text('description'),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const clinics = pgTable(
  'clinics',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    cnpj: text('cnpj').notNull().unique(),
    phone: text('phone'),
    email: text('email'),
    address: text('address'),
    subscriberId: text('subscriber_id')
      .notNull()
      .references(() => subscribers.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [index('clinics_subscriber_id_idx').on(t.subscriberId)]
);

export const professionals = pgTable('professionals', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  cpf: text('cpf').notNull().unique(),
  phone: text('phone'),
  status: professionalStatusEnum('status').notNull().default('INVITED'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const professionalClinics = pgTable(
  'professional_clinics',
  {
    professionalId: text('professional_id')
      .notNull()
      .references(() => professionals.id, { onDelete: 'cascade' }),
    clinicId: text('clinic_id')
      .notNull()
      .references(() => clinics.id, { onDelete: 'cascade' }),
    role: professionalRoleEnum('role').notNull().default('DENTIST'),
  },
  (t) => [primaryKey({ columns: [t.professionalId, t.clinicId] })]
);

export const patients = pgTable(
  'patients',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    name: text('name').notNull(),
    cpf: text('cpf').notNull(),
    birthDate: timestamp('birth_date'),
    phone: text('phone'),
    email: text('email'),
    clinicId: text('clinic_id')
      .notNull()
      .references(() => clinics.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    unique('patients_cpf_clinic_id_key').on(t.cpf, t.clinicId),
    index('patients_clinic_id_idx').on(t.clinicId),
  ]
);

export const subscriptions = pgTable('subscriptions', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  subscriberId: text('subscriber_id')
    .notNull()
    .references(() => subscribers.id, { onDelete: 'cascade' }),
  planId: text('plan_id')
    .notNull()
    .references(() => plans.id),
  status: subscriptionStatusEnum('status').notNull().default('TRIAL'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

// ─── Auth ────────────────────────────────────────────────────────────────────

export const userCredentials = pgTable('user_credentials', {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  subscriberId: text('subscriber_id')
    .unique()
    .references(() => subscribers.id, { onDelete: 'cascade' }),
  professionalId: text('professional_id')
    .unique()
    .references(() => professionals.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});

export const emailVerificationTokens = pgTable(
  'email_verification_tokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    tokenHash: text('token_hash').notNull().unique(),
    email: text('email').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('email_verification_tokens_email_idx').on(t.email)]
);

export const inviteTokens = pgTable(
  'invite_tokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    tokenHash: text('token_hash').notNull().unique(),
    professionalId: text('professional_id')
      .notNull()
      .references(() => professionals.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at').notNull(),
    acceptedAt: timestamp('accepted_at'),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('invite_tokens_professional_id_idx').on(t.professionalId)]
);

export const refreshTokens = pgTable(
  'refresh_tokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    tokenHash: text('token_hash').notNull().unique(),
    familyId: text('family_id').notNull(),
    userId: text('user_id').notNull(),
    userType: userTypeEnum('user_type').notNull(),
    clinicId: text('clinic_id'),
    expiresAt: timestamp('expires_at').notNull(),
    revokedAt: timestamp('revoked_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('refresh_tokens_user_id_idx').on(t.userId),
    index('refresh_tokens_family_id_idx').on(t.familyId),
  ]
);

export const passwordResetTokens = pgTable(
  'password_reset_tokens',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    tokenHash: text('token_hash').notNull().unique(),
    email: text('email').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    usedAt: timestamp('used_at'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [index('password_reset_tokens_email_idx').on(t.email)]
);

// ─── Audit ───────────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    action: text('action').notNull(),
    entity: text('entity'),
    entityId: text('entity_id'),
    userId: text('user_id').notNull(),
    userType: userTypeEnum('user_type').notNull(),
    subscriberId: text('subscriber_id').notNull(),
    clinicId: text('clinic_id'),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    before: json('before'),
    after: json('after'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (t) => [
    index('audit_logs_subscriber_id_idx').on(t.subscriberId),
    index('audit_logs_user_id_idx').on(t.userId),
    index('audit_logs_entity_entity_id_idx').on(t.entity, t.entityId),
  ]
);

// ─── Relations ───────────────────────────────────────────────────────────────

export const subscribersRelations = relations(subscribers, ({ many, one }) => ({
  clinics: many(clinics),
  subscriptions: many(subscriptions),
  credential: one(userCredentials, {
    fields: [subscribers.id],
    references: [userCredentials.subscriberId],
  }),
}));

export const plansRelations = relations(plans, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const clinicsRelations = relations(clinics, ({ one, many }) => ({
  subscriber: one(subscribers, {
    fields: [clinics.subscriberId],
    references: [subscribers.id],
  }),
  professionals: many(professionalClinics),
  patients: many(patients),
}));

export const professionalsRelations = relations(professionals, ({ many, one }) => ({
  clinics: many(professionalClinics),
  credential: one(userCredentials, {
    fields: [professionals.id],
    references: [userCredentials.professionalId],
  }),
  inviteTokens: many(inviteTokens),
}));

export const professionalClinicsRelations = relations(professionalClinics, ({ one }) => ({
  professional: one(professionals, {
    fields: [professionalClinics.professionalId],
    references: [professionals.id],
  }),
  clinic: one(clinics, {
    fields: [professionalClinics.clinicId],
    references: [clinics.id],
  }),
}));

export const patientsRelations = relations(patients, ({ one }) => ({
  clinic: one(clinics, {
    fields: [patients.clinicId],
    references: [clinics.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [subscriptions.subscriberId],
    references: [subscribers.id],
  }),
  plan: one(plans, {
    fields: [subscriptions.planId],
    references: [plans.id],
  }),
}));

export const userCredentialsRelations = relations(userCredentials, ({ one }) => ({
  subscriber: one(subscribers, {
    fields: [userCredentials.subscriberId],
    references: [subscribers.id],
  }),
  professional: one(professionals, {
    fields: [userCredentials.professionalId],
    references: [professionals.id],
  }),
}));

export const inviteTokensRelations = relations(inviteTokens, ({ one }) => ({
  professional: one(professionals, {
    fields: [inviteTokens.professionalId],
    references: [professionals.id],
  }),
}));
