import { IsDateString, IsEnum, IsOptional } from 'class-validator';
import type { SubscriptionStatus } from '../../../../domain/entities/subscription.entity';

export class UpdateSubscriptionDto {
  @IsOptional()
  @IsEnum(['TRIAL', 'ACTIVE', 'INACTIVE', 'CANCELLED'])
  status?: SubscriptionStatus;

  @IsOptional()
  @IsDateString()
  endDate?: string | null;
}
