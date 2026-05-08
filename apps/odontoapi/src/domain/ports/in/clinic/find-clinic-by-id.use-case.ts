export const FIND_CLINIC_BY_ID_USE_CASE = Symbol('IFindClinicByIdUseCase');

export interface FindClinicByIdInput {
  id: string;
}

export interface FindClinicByIdOutput {
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

export interface IFindClinicByIdUseCase {
  execute(input: FindClinicByIdInput): Promise<FindClinicByIdOutput>;
}
