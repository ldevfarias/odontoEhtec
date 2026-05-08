export const UPDATE_PATIENT_USE_CASE = Symbol('IUpdatePatientUseCase');

export interface UpdatePatientInput {
  id: string;
  name?: string;
  phone?: string | null;
  email?: string | null;
  birthDate?: Date | null;
}

export interface UpdatePatientOutput {
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

export interface IUpdatePatientUseCase {
  execute(input: UpdatePatientInput): Promise<UpdatePatientOutput>;
}
