import type { ProfessionalRole } from '../../../entities/professional.entity';

export const CREATE_PROFESSIONAL_USE_CASE = Symbol('ICreateProfessionalUseCase');

export interface CreateProfessionalInput {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  role: ProfessionalRole;
  clinicId: string;
}

export interface CreateProfessionalOutput {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  role: ProfessionalRole;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProfessionalUseCase {
  execute(input: CreateProfessionalInput): Promise<CreateProfessionalOutput>;
}
