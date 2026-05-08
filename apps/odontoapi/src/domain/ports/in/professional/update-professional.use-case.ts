import type { ProfessionalRole } from '../../../entities/professional.entity';

export const UPDATE_PROFESSIONAL_USE_CASE = Symbol('IUpdateProfessionalUseCase');

export interface UpdateProfessionalInput {
  id: string;
  name?: string;
  phone?: string | null;
  role?: ProfessionalRole;
}

export interface UpdateProfessionalOutput {
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

export interface IUpdateProfessionalUseCase {
  execute(input: UpdateProfessionalInput): Promise<UpdateProfessionalOutput>;
}
