import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import type { SubscriptionStatus } from '../../../../domain/entities/subscription.entity';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  subscriberId!: string;

  @IsString()
  @IsNotEmpty()
  planId!: string;

  @IsEnum(['TRIAL', 'ACTIVE', 'INACTIVE', 'CANCELLED'])
  status!: SubscriptionStatus;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
