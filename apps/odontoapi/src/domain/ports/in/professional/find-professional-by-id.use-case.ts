import type { ProfessionalStatus } from '../../../entities/professional.entity';

export const FIND_PROFESSIONAL_BY_ID_USE_CASE = Symbol('IFindProfessionalByIdUseCase');

export interface FindProfessionalByIdInput {
  id: string;
}

export interface FindProfessionalByIdOutput {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  status: ProfessionalStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindProfessionalByIdUseCase {
  execute(input: FindProfessionalByIdInput): Promise<FindProfessionalByIdOutput>;
}
