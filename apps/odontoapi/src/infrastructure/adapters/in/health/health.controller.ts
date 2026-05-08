import { Controller, Get, Inject } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import type { ApiResponse } from '@odontoehtec/shared';
import {
  CHECK_HEALTH_USE_CASE,
  type CheckHealthOutput,
  type ICheckHealthUseCase,
} from '../../../../domain/ports/in/health/check-health.use-case';

@Controller('health')
@ApiTags('Health')
export class HealthController {
  constructor(
    @Inject(CHECK_HEALTH_USE_CASE)
    private readonly checkHealth: ICheckHealthUseCase
  ) {}

  @Get()
  async check(): Promise<ApiResponse<CheckHealthOutput>> {
    const data = await this.checkHealth.execute();
    return { data };
  }
}
