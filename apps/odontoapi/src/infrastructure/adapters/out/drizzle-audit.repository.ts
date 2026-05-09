import { Injectable, Logger } from '@nestjs/common';
import type {
  CreateAuditLogData,
  IAuditRepository,
} from '../../../domain/ports/out/audit.repository';
import { auditLogs } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleAuditRepository implements IAuditRepository {
  private readonly logger = new Logger(DrizzleAuditRepository.name);

  constructor(private readonly drizzle: DrizzleService) {}

  async log(data: CreateAuditLogData): Promise<void> {
    try {
      await this.drizzle.db.insert(auditLogs).values({
        action: data.action,
        entity: data.entity ?? null,
        entityId: data.entityId ?? null,
        userId: data.userId,
        userType: data.userType,
        subscriberId: data.subscriberId,
        clinicId: data.clinicId ?? null,
        ipAddress: data.ipAddress ?? null,
        userAgent: data.userAgent ?? null,
        before: data.before !== undefined ? data.before : null,
        after: data.after !== undefined ? data.after : null,
      });
    } catch (err) {
      // Audit failures must never crash the main flow
      this.logger.error(
        `Failed to write audit log: action=${data.action} userId=${data.userId}`,
        err
      );
    }
  }
}
