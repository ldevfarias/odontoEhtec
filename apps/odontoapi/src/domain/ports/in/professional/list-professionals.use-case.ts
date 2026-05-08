import type { ProfessionalRole } from '../../../entities/professional.entity';

export const LIST_PROFESSIONALS_USE_CASE = Symbol('IListProfessionalsUseCase');

export interface ListProfessionalsInput {
  clinicId: string;
  page: number;
  limit: number;
}

export interface ProfessionalItem {
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

export interface ListProfessionalsOutput {
  items: ProfessionalItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListProfessionalsUseCase {
  execute(input: ListProfessionalsInput): Promise<ListProfessionalsOutput>;
}
