import type { Professional } from '../../entities/professional.entity';

export const PROFESSIONAL_REPOSITORY = Symbol('IProfessionalRepository');

export interface CreateProfessionalData {
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
}

export interface UpdateProfessionalData {
  name?: string;
  phone?: string | null;
  status?: 'INVITED' | 'ACTIVE' | 'INACTIVE';
}

export interface UpsertProfessionalForInviteData {
  name: string;
  email: string;
  cpf: string;
  phone: string | null;
  clinicId: string;
  role: 'DENTIST' | 'RECEPTIONIST' | 'ASSISTANT';
}

export interface ProfessionalPage {
  items: Professional[];
  total: number;
}

export interface IProfessionalRepository {
  create(data: CreateProfessionalData): Promise<Professional>;
  findById(id: string): Promise<Professional | null>;
  findByEmail(email: string): Promise<Professional | null>;
  findByCpf(cpf: string): Promise<Professional | null>;
  findAllByClinic(clinicId: string, page: number, limit: number): Promise<ProfessionalPage>;
  update(id: string, data: UpdateProfessionalData): Promise<Professional>;
  delete(id: string): Promise<void>;
  upsertForInvite(data: UpsertProfessionalForInviteData): Promise<Professional>;
  getFirstClinicId(professionalId: string): Promise<string | null>;
}
