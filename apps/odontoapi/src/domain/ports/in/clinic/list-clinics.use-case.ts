export const LIST_CLINICS_USE_CASE = Symbol('IListClinicsUseCase');

export interface ListClinicsInput {
  subscriberId: string;
  page: number;
  limit: number;
}

export interface ClinicItem {
  id: string;
  name: string;
  cnpj: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  subscriberId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListClinicsOutput {
  items: ClinicItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListClinicsUseCase {
  execute(input: ListClinicsInput): Promise<ListClinicsOutput>;
}
