import type { Clinic } from '../../entities/clinic.entity';

export const CLINIC_REPOSITORY = Symbol('IClinicRepository');

export interface CreateClinicData {
  name: string;
  cnpj: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  subscriberId: string;
}

export interface UpdateClinicData {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
}

export interface ClinicPage {
  items: Clinic[];
  total: number;
}

export interface IClinicRepository {
  create(data: CreateClinicData): Promise<Clinic>;
  findById(id: string): Promise<Clinic | null>;
  findByCnpj(cnpj: string): Promise<Clinic | null>;
  findAllBySubscriber(subscriberId: string, page: number, limit: number): Promise<ClinicPage>;
  update(id: string, data: UpdateClinicData): Promise<Clinic>;
  delete(id: string): Promise<void>;
}
