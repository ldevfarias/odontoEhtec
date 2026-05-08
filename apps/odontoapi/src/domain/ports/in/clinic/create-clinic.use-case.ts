export const CREATE_CLINIC_USE_CASE = Symbol('ICreateClinicUseCase');

export interface CreateClinicInput {
  name: string;
  cnpj: string;
  phone?: string;
  email?: string;
  address?: string;
  subscriberId: string;
}

export interface CreateClinicOutput {
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

export interface ICreateClinicUseCase {
  execute(input: CreateClinicInput): Promise<CreateClinicOutput>;
}
