import { Injectable } from '@nestjs/common';
import { sql } from 'drizzle-orm';
import type { IDatabaseHealthChecker } from '../../../domain/ports/out/database-health-checker.port';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleDatabaseHealthChecker implements IDatabaseHealthChecker {
  constructor(private readonly drizzle: DrizzleService) {}

  async isHealthy(): Promise<boolean> {
    const timeout = new Promise<false>((resolve) => {
      setTimeout(() => resolve(false), 500);
    });

    const query = this.drizzle.db
      .execute(sql`SELECT 1`)
      .then(() => true as const)
      .catch(() => false as const);

    return Promise.race([query, timeout]);
  }
}
