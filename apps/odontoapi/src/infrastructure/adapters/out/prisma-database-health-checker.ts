import { Injectable } from '@nestjs/common';
import type { PrismaService } from './prisma.service';
import type { IDatabaseHealthChecker } from '../../../domain/ports/out/database-health-checker.port';

@Injectable()
export class PrismaDatabaseHealthChecker implements IDatabaseHealthChecker {
  constructor(private readonly prisma: PrismaService) {}

  async isHealthy(): Promise<boolean> {
    const timeout = new Promise<false>((resolve) => {
      setTimeout(() => resolve(false), 500);
    });

    const query = this.prisma.$queryRaw`SELECT 1`.then(() => true).catch(() => false);

    return Promise.race([query, timeout]);
  }
}
