import { IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @Matches(/^\d{11}$|^\d{3}\.\d{3}\.\d{3}-\d{2}$/, { message: 'cpf inválido' })
  cpf!: string;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @IsNotEmpty()
  clinicId!: string;
}
