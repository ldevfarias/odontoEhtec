import type { ProfessionalStatus } from '../../../entities/professional.entity';

export const UPDATE_PROFESSIONAL_USE_CASE = Symbol('IUpdateProfessionalUseCase');

export interface UpdateProfessionalInput {
  id: string;
  name?: string;
  phone?: string | null;
}

export interface UpdateProfessionalOutput {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  status: ProfessionalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateProfessionalUseCase {
  execute(input: UpdateProfessionalInput): Promise<UpdateProfessionalOutput>;
}
