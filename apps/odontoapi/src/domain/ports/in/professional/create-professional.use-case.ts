import type { ProfessionalStatus } from '../../../entities/professional.entity';

export const CREATE_PROFESSIONAL_USE_CASE = Symbol('ICreateProfessionalUseCase');

export interface CreateProfessionalInput {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
}

export interface CreateProfessionalOutput {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  status: ProfessionalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateProfessionalUseCase {
  execute(input: CreateProfessionalInput): Promise<CreateProfessionalOutput>;
}
