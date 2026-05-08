export const LIST_PATIENTS_USE_CASE = Symbol('IListPatientsUseCase');

export interface ListPatientsInput {
  clinicId: string;
  page: number;
  limit: number;
}

export interface PatientItem {
  id: string;
  name: string;
  cpf: string;
  birthDate: Date | null;
  phone: string | null;
  email: string | null;
  clinicId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPatientsOutput {
  items: PatientItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListPatientsUseCase {
  execute(input: ListPatientsInput): Promise<ListPatientsOutput>;
}
