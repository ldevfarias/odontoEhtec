export const FIND_PATIENT_BY_ID_USE_CASE = Symbol('IFindPatientByIdUseCase');

export interface FindPatientByIdInput {
  id: string;
}

export interface FindPatientByIdOutput {
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

export interface IFindPatientByIdUseCase {
  execute(input: FindPatientByIdInput): Promise<FindPatientByIdOutput>;
}
