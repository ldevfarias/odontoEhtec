'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.inviteTokensRelations =
  exports.userCredentialsRelations =
  exports.subscriptionsRelations =
  exports.patientsRelations =
  exports.professionalClinicsRelations =
  exports.professionalsRelations =
  exports.clinicsRelations =
  exports.plansRelations =
  exports.subscribersRelations =
  exports.auditLogs =
  exports.passwordResetTokens =
  exports.refreshTokens =
  exports.inviteTokens =
  exports.emailVerificationTokens =
  exports.userCredentials =
  exports.subscriptions =
  exports.patients =
  exports.professionalClinics =
  exports.professionals =
  exports.clinics =
  exports.plans =
  exports.subscribers =
  exports.subscriptionStatusEnum =
  exports.userTypeEnum =
  exports.professionalStatusEnum =
  exports.professionalRoleEnum =
    void 0;
const crypto_1 = require('crypto');
const drizzle_orm_1 = require('drizzle-orm');
const pg_core_1 = require('drizzle-orm/pg-core');
// ─── Enums ───────────────────────────────────────────────────────────────────
exports.professionalRoleEnum = (0, pg_core_1.pgEnum)('professional_role', [
  'DENTIST',
  'RECEPTIONIST',
  'ASSISTANT',
]);
exports.professionalStatusEnum = (0, pg_core_1.pgEnum)('professional_status', [
  'INVITED',
  'ACTIVE',
  'INACTIVE',
]);
exports.userTypeEnum = (0, pg_core_1.pgEnum)('user_type', ['SUBSCRIBER', 'PROFESSIONAL']);
exports.subscriptionStatusEnum = (0, pg_core_1.pgEnum)('subscription_status', [
  'TRIAL',
  'ACTIVE',
  'INACTIVE',
  'CANCELLED',
]);
// ─── Tables ──────────────────────────────────────────────────────────────────
exports.subscribers = (0, pg_core_1.pgTable)('subscribers', {
  id: (0, pg_core_1.text)('id')
    .primaryKey()
    .$defaultFn(() => (0, crypto_1.randomUUID)()),
  name: (0, pg_core_1.text)('name').notNull(),
  email: (0, pg_core_1.text)('email').notNull().unique(),
  document: (0, pg_core_1.text)('document').notNull().unique(),
  phone: (0, pg_core_1.text)('phone'),
  createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  updatedAt: (0, pg_core_1.timestamp)('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
exports.plans = (0, pg_core_1.pgTable)('plans', {
  id: (0, pg_core_1.text)('id')
    .primaryKey()
    .$defaultFn(() => (0, crypto_1.randomUUID)()),
  name: (0, pg_core_1.text)('name').notNull().unique(),
  description: (0, pg_core_1.text)('description'),
  price: (0, pg_core_1.numeric)('price', { precision: 10, scale: 2 }).notNull(),
  isActive: (0, pg_core_1.boolean)('is_active').notNull().default(true),
  createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  updatedAt: (0, pg_core_1.timestamp)('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
exports.clinics = (0, pg_core_1.pgTable)(
  'clinics',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    name: (0, pg_core_1.text)('name').notNull(),
    cnpj: (0, pg_core_1.text)('cnpj').notNull().unique(),
    phone: (0, pg_core_1.text)('phone'),
    email: (0, pg_core_1.text)('email'),
    address: (0, pg_core_1.text)('address'),
    subscriberId: (0, pg_core_1.text)('subscriber_id')
      .notNull()
      .references(() => exports.subscribers.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [(0, pg_core_1.index)('clinics_subscriber_id_idx').on(t.subscriberId)]
);
exports.professionals = (0, pg_core_1.pgTable)('professionals', {
  id: (0, pg_core_1.text)('id')
    .primaryKey()
    .$defaultFn(() => (0, crypto_1.randomUUID)()),
  name: (0, pg_core_1.text)('name').notNull(),
  email: (0, pg_core_1.text)('email').notNull().unique(),
  cpf: (0, pg_core_1.text)('cpf').notNull().unique(),
  phone: (0, pg_core_1.text)('phone'),
  status: (0, exports.professionalStatusEnum)('status').notNull().default('INVITED'),
  createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  updatedAt: (0, pg_core_1.timestamp)('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
exports.professionalClinics = (0, pg_core_1.pgTable)(
  'professional_clinics',
  {
    professionalId: (0, pg_core_1.text)('professional_id')
      .notNull()
      .references(() => exports.professionals.id, { onDelete: 'cascade' }),
    clinicId: (0, pg_core_1.text)('clinic_id')
      .notNull()
      .references(() => exports.clinics.id, { onDelete: 'cascade' }),
    role: (0, exports.professionalRoleEnum)('role').notNull().default('DENTIST'),
  },
  (t) => [(0, pg_core_1.primaryKey)({ columns: [t.professionalId, t.clinicId] })]
);
exports.patients = (0, pg_core_1.pgTable)(
  'patients',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    name: (0, pg_core_1.text)('name').notNull(),
    cpf: (0, pg_core_1.text)('cpf').notNull(),
    birthDate: (0, pg_core_1.timestamp)('birth_date'),
    phone: (0, pg_core_1.text)('phone'),
    email: (0, pg_core_1.text)('email'),
    clinicId: (0, pg_core_1.text)('clinic_id')
      .notNull()
      .references(() => exports.clinics.id, { onDelete: 'cascade' }),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)('updated_at')
      .defaultNow()
      .notNull()
      .$onUpdateFn(() => new Date()),
  },
  (t) => [
    (0, pg_core_1.unique)('patients_cpf_clinic_id_key').on(t.cpf, t.clinicId),
    (0, pg_core_1.index)('patients_clinic_id_idx').on(t.clinicId),
  ]
);
exports.subscriptions = (0, pg_core_1.pgTable)('subscriptions', {
  id: (0, pg_core_1.text)('id')
    .primaryKey()
    .$defaultFn(() => (0, crypto_1.randomUUID)()),
  subscriberId: (0, pg_core_1.text)('subscriber_id')
    .notNull()
    .references(() => exports.subscribers.id, { onDelete: 'cascade' }),
  planId: (0, pg_core_1.text)('plan_id')
    .notNull()
    .references(() => exports.plans.id),
  status: (0, exports.subscriptionStatusEnum)('status').notNull().default('TRIAL'),
  startDate: (0, pg_core_1.timestamp)('start_date').notNull(),
  endDate: (0, pg_core_1.timestamp)('end_date'),
  createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  updatedAt: (0, pg_core_1.timestamp)('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
// ─── Auth ────────────────────────────────────────────────────────────────────
exports.userCredentials = (0, pg_core_1.pgTable)('user_credentials', {
  id: (0, pg_core_1.text)('id')
    .primaryKey()
    .$defaultFn(() => (0, crypto_1.randomUUID)()),
  email: (0, pg_core_1.text)('email').notNull().unique(),
  passwordHash: (0, pg_core_1.text)('password_hash').notNull(),
  subscriberId: (0, pg_core_1.text)('subscriber_id')
    .unique()
    .references(() => exports.subscribers.id, { onDelete: 'cascade' }),
  professionalId: (0, pg_core_1.text)('professional_id')
    .unique()
    .references(() => exports.professionals.id, { onDelete: 'cascade' }),
  createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  updatedAt: (0, pg_core_1.timestamp)('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdateFn(() => new Date()),
});
exports.emailVerificationTokens = (0, pg_core_1.pgTable)(
  'email_verification_tokens',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    tokenHash: (0, pg_core_1.text)('token_hash').notNull().unique(),
    email: (0, pg_core_1.text)('email').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    usedAt: (0, pg_core_1.timestamp)('used_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  },
  (t) => [(0, pg_core_1.index)('email_verification_tokens_email_idx').on(t.email)]
);
exports.inviteTokens = (0, pg_core_1.pgTable)(
  'invite_tokens',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    tokenHash: (0, pg_core_1.text)('token_hash').notNull().unique(),
    professionalId: (0, pg_core_1.text)('professional_id')
      .notNull()
      .references(() => exports.professionals.id, { onDelete: 'cascade' }),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    acceptedAt: (0, pg_core_1.timestamp)('accepted_at'),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  },
  (t) => [(0, pg_core_1.index)('invite_tokens_professional_id_idx').on(t.professionalId)]
);
exports.refreshTokens = (0, pg_core_1.pgTable)(
  'refresh_tokens',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    tokenHash: (0, pg_core_1.text)('token_hash').notNull().unique(),
    familyId: (0, pg_core_1.text)('family_id').notNull(),
    userId: (0, pg_core_1.text)('user_id').notNull(),
    userType: (0, exports.userTypeEnum)('user_type').notNull(),
    clinicId: (0, pg_core_1.text)('clinic_id'),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    revokedAt: (0, pg_core_1.timestamp)('revoked_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  },
  (t) => [
    (0, pg_core_1.index)('refresh_tokens_user_id_idx').on(t.userId),
    (0, pg_core_1.index)('refresh_tokens_family_id_idx').on(t.familyId),
  ]
);
exports.passwordResetTokens = (0, pg_core_1.pgTable)(
  'password_reset_tokens',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    tokenHash: (0, pg_core_1.text)('token_hash').notNull().unique(),
    email: (0, pg_core_1.text)('email').notNull(),
    expiresAt: (0, pg_core_1.timestamp)('expires_at').notNull(),
    usedAt: (0, pg_core_1.timestamp)('used_at'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  },
  (t) => [(0, pg_core_1.index)('password_reset_tokens_email_idx').on(t.email)]
);
// ─── Audit ───────────────────────────────────────────────────────────────────
exports.auditLogs = (0, pg_core_1.pgTable)(
  'audit_logs',
  {
    id: (0, pg_core_1.text)('id')
      .primaryKey()
      .$defaultFn(() => (0, crypto_1.randomUUID)()),
    action: (0, pg_core_1.text)('action').notNull(),
    entity: (0, pg_core_1.text)('entity'),
    entityId: (0, pg_core_1.text)('entity_id'),
    userId: (0, pg_core_1.text)('user_id').notNull(),
    userType: (0, exports.userTypeEnum)('user_type').notNull(),
    subscriberId: (0, pg_core_1.text)('subscriber_id').notNull(),
    clinicId: (0, pg_core_1.text)('clinic_id'),
    ipAddress: (0, pg_core_1.text)('ip_address'),
    userAgent: (0, pg_core_1.text)('user_agent'),
    before: (0, pg_core_1.json)('before'),
    after: (0, pg_core_1.json)('after'),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
  },
  (t) => [
    (0, pg_core_1.index)('audit_logs_subscriber_id_idx').on(t.subscriberId),
    (0, pg_core_1.index)('audit_logs_user_id_idx').on(t.userId),
    (0, pg_core_1.index)('audit_logs_entity_entity_id_idx').on(t.entity, t.entityId),
  ]
);
// ─── Relations ───────────────────────────────────────────────────────────────
exports.subscribersRelations = (0, drizzle_orm_1.relations)(
  exports.subscribers,
  ({ many, one }) => ({
    clinics: many(exports.clinics),
    subscriptions: many(exports.subscriptions),
    credential: one(exports.userCredentials, {
      fields: [exports.subscribers.id],
      references: [exports.userCredentials.subscriberId],
    }),
  })
);
exports.plansRelations = (0, drizzle_orm_1.relations)(exports.plans, ({ many }) => ({
  subscriptions: many(exports.subscriptions),
}));
exports.clinicsRelations = (0, drizzle_orm_1.relations)(exports.clinics, ({ one, many }) => ({
  subscriber: one(exports.subscribers, {
    fields: [exports.clinics.subscriberId],
    references: [exports.subscribers.id],
  }),
  professionals: many(exports.professionalClinics),
  patients: many(exports.patients),
}));
exports.professionalsRelations = (0, drizzle_orm_1.relations)(
  exports.professionals,
  ({ many, one }) => ({
    clinics: many(exports.professionalClinics),
    credential: one(exports.userCredentials, {
      fields: [exports.professionals.id],
      references: [exports.userCredentials.professionalId],
    }),
    inviteTokens: many(exports.inviteTokens),
  })
);
exports.professionalClinicsRelations = (0, drizzle_orm_1.relations)(
  exports.professionalClinics,
  ({ one }) => ({
    professional: one(exports.professionals, {
      fields: [exports.professionalClinics.professionalId],
      references: [exports.professionals.id],
    }),
    clinic: one(exports.clinics, {
      fields: [exports.professionalClinics.clinicId],
      references: [exports.clinics.id],
    }),
  })
);
exports.patientsRelations = (0, drizzle_orm_1.relations)(exports.patients, ({ one }) => ({
  clinic: one(exports.clinics, {
    fields: [exports.patients.clinicId],
    references: [exports.clinics.id],
  }),
}));
exports.subscriptionsRelations = (0, drizzle_orm_1.relations)(exports.subscriptions, ({ one }) => ({
  subscriber: one(exports.subscribers, {
    fields: [exports.subscriptions.subscriberId],
    references: [exports.subscribers.id],
  }),
  plan: one(exports.plans, {
    fields: [exports.subscriptions.planId],
    references: [exports.plans.id],
  }),
}));
exports.userCredentialsRelations = (0, drizzle_orm_1.relations)(
  exports.userCredentials,
  ({ one }) => ({
    subscriber: one(exports.subscribers, {
      fields: [exports.userCredentials.subscriberId],
      references: [exports.subscribers.id],
    }),
    professional: one(exports.professionals, {
      fields: [exports.userCredentials.professionalId],
      references: [exports.professionals.id],
    }),
  })
);
exports.inviteTokensRelations = (0, drizzle_orm_1.relations)(exports.inviteTokens, ({ one }) => ({
  professional: one(exports.professionals, {
    fields: [exports.inviteTokens.professionalId],
    references: [exports.professionals.id],
  }),
}));
//# sourceMappingURL=schema.js.map
