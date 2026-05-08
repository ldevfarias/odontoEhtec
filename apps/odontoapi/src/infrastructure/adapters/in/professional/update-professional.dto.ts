import { IsEnum, IsOptional, IsString } from 'class-validator';
import type { ProfessionalRole } from '../../../../domain/entities/professional.entity';

export class UpdateProfessionalDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string | null;

  @IsOptional()
  @IsEnum(['DENTIST', 'RECEPTIONIST', 'ADMIN'])
  role?: ProfessionalRole;
}
