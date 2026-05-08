import { Inject, Injectable } from '@nestjs/common';
import {
  type CheckHealthOutput,
  type ICheckHealthUseCase,
} from '../../../domain/ports/in/health/check-health.use-case';
import {
  DATABASE_HEALTH_CHECKER,
  type IDatabaseHealthChecker,
} from '../../../domain/ports/out/database-health-checker.port';

@Injectable()
export class CheckHealthUseCase implements ICheckHealthUseCase {
  constructor(
    @Inject(DATABASE_HEALTH_CHECKER)
    private readonly databaseHealthChecker: IDatabaseHealthChecker
  ) {}

  async execute(): Promise<CheckHealthOutput> {
    const database = await this.databaseHealthChecker.isHealthy();

    return {
      status: database ? 'ok' : 'degraded',
      checks: {
        app: 'ok',
        database: database ? 'ok' : 'error',
      },
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
