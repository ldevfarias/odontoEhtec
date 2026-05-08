import type { Patient } from '../../entities/patient.entity';

export const PATIENT_REPOSITORY = Symbol('IPatientRepository');

export interface CreatePatientData {
  name: string;
  cpf: string;
  birthDate: Date | null;
  phone: string | null;
  email: string | null;
  clinicId: string;
}

export interface UpdatePatientData {
  name?: string;
  phone?: string | null;
  email?: string | null;
  birthDate?: Date | null;
}

export interface PatientPage {
  items: Patient[];
  total: number;
}

export interface IPatientRepository {
  create(data: CreatePatientData): Promise<Patient>;
  findById(id: string): Promise<Patient | null>;
  findByCpfAndClinic(cpf: string, clinicId: string): Promise<Patient | null>;
  findAllByClinic(clinicId: string, page: number, limit: number): Promise<PatientPage>;
  update(id: string, data: UpdatePatientData): Promise<Patient>;
  delete(id: string): Promise<void>;
}
