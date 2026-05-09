import { Injectable } from '@nestjs/common';
import { and, count, desc, eq } from 'drizzle-orm';
import type { Patient } from '../../../domain/entities/patient.entity';
import type {
  CreatePatientData,
  IPatientRepository,
  PatientPage,
  UpdatePatientData,
} from '../../../domain/ports/out/patient.repository';
import { patients } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzlePatientRepository implements IPatientRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreatePatientData): Promise<Patient> {
    const [row] = await this.drizzle.db.insert(patients).values(data).returning();
    return row as Patient;
  }

  async findById(id: string): Promise<Patient | null> {
    const [row] = await this.drizzle.db.select().from(patients).where(eq(patients.id, id)).limit(1);
    return (row as Patient) ?? null;
  }

  async findByCpfAndClinic(cpf: string, clinicId: string): Promise<Patient | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(patients)
      .where(and(eq(patients.cpf, cpf), eq(patients.clinicId, clinicId)))
      .limit(1);
    return (row as Patient) ?? null;
  }

  async findAllByClinic(clinicId: string, page: number, limit: number): Promise<PatientPage> {
    const skip = (page - 1) * limit;
    const [items, [{ value: total }]] = await Promise.all([
      this.drizzle.db
        .select()
        .from(patients)
        .where(eq(patients.clinicId, clinicId))
        .orderBy(desc(patients.createdAt))
        .offset(skip)
        .limit(limit),
      this.drizzle.db
        .select({ value: count() })
        .from(patients)
        .where(eq(patients.clinicId, clinicId)),
    ]);
    return { items: items as Patient[], total: Number(total) };
  }

  async update(id: string, data: UpdatePatientData): Promise<Patient> {
    const [row] = await this.drizzle.db
      .update(patients)
      .set(data)
      .where(eq(patients.id, id))
      .returning();
    return row as Patient;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(patients).where(eq(patients.id, id));
  }
}
