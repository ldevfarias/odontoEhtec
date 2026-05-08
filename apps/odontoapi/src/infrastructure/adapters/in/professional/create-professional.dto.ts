import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import type { ProfessionalRole } from '../../../../domain/entities/professional.entity';

export class CreateProfessionalDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @Matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'cpf inválido' })
  cpf!: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(['DENTIST', 'RECEPTIONIST', 'ADMIN'])
  role!: ProfessionalRole;

  @IsString()
  @IsNotEmpty()
  clinicId!: string;
}
