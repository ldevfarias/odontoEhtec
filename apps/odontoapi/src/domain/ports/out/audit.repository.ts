export const AUDIT_REPOSITORY = Symbol('IAuditRepository');

export interface CreateAuditLogData {
  action: string;
  entity?: string;
  entityId?: string;
  userId: string;
  userType: 'SUBSCRIBER' | 'PROFESSIONAL';
  subscriberId: string;
  clinicId?: string;
  ipAddress?: string;
  userAgent?: string;
  before?: Record<string, unknown>;
  after?: Record<string, unknown>;
}

export interface IAuditRepository {
  log(data: CreateAuditLogData): Promise<void>;
}
