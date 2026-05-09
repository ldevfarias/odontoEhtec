import { Module } from '@nestjs/common';
import { CHECK_HEALTH_USE_CASE } from '../../domain/ports/in/health/check-health.use-case';
import { DATABASE_HEALTH_CHECKER } from '../../domain/ports/out/database-health-checker.port';
import { CheckHealthUseCase } from '../../application/use-cases/health/check-health.use-case';
import { HealthController } from '../adapters/in/health/health.controller';
import { DrizzleDatabaseHealthChecker } from '../adapters/out/drizzle-database-health-checker';

@Module({
  providers: [
    {
      provide: DATABASE_HEALTH_CHECKER,
      useClass: DrizzleDatabaseHealthChecker,
    },
    {
      provide: CHECK_HEALTH_USE_CASE,
      useClass: CheckHealthUseCase,
    },
  ],
  controllers: [HealthController],
})
export class HealthModule {}
