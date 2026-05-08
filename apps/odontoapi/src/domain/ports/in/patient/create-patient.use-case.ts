export const CREATE_PATIENT_USE_CASE = Symbol('ICreatePatientUseCase');

export interface CreatePatientInput {
  name: string;
  cpf: string;
  birthDate?: Date | null;
  phone?: string;
  email?: string;
  clinicId: string;
}

export interface CreatePatientOutput {
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

export interface ICreatePatientUseCase {
  execute(input: CreatePatientInput): Promise<CreatePatientOutput>;
}
