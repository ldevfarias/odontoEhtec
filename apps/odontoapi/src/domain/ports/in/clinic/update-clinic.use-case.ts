export const UPDATE_CLINIC_USE_CASE = Symbol('IUpdateClinicUseCase');

export interface UpdateClinicInput {
  id: string;
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface UpdateClinicOutput {
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

export interface IUpdateClinicUseCase {
  execute(input: UpdateClinicInput): Promise<UpdateClinicOutput>;
}
