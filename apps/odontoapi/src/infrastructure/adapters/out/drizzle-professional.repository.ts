import { Injectable } from '@nestjs/common';
import { count, desc, eq, inArray } from 'drizzle-orm';
import type { Professional } from '../../../domain/entities/professional.entity';
import type {
  CreateProfessionalData,
  IProfessionalRepository,
  ProfessionalPage,
  UpdateProfessionalData,
  UpsertProfessionalForInviteData,
} from '../../../domain/ports/out/professional.repository';
import { professionalClinics, professionals } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleProfessionalRepository implements IProfessionalRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateProfessionalData): Promise<Professional> {
    const [row] = await this.drizzle.db
      .insert(professionals)
      .values({ ...data, status: 'INVITED' })
      .returning();
    return row as Professional;
  }

  async findById(id: string): Promise<Professional | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(professionals)
      .where(eq(professionals.id, id))
      .limit(1);
    return (row as Professional) ?? null;
  }

  async findByEmail(email: string): Promise<Professional | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(professionals)
      .where(eq(professionals.email, email))
      .limit(1);
    return (row as Professional) ?? null;
  }

  async findByCpf(cpf: string): Promise<Professional | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(professionals)
      .where(eq(professionals.cpf, cpf))
      .limit(1);
    return (row as Professional) ?? null;
  }

  async findAllByClinic(clinicId: string, page: number, limit: number): Promise<ProfessionalPage> {
    const skip = (page - 1) * limit;
    const memberIds = await this.drizzle.db
      .select({ professionalId: professionalClinics.professionalId })
      .from(professionalClinics)
      .where(eq(professionalClinics.clinicId, clinicId));

    const ids = memberIds.map((r) => r.professionalId);
    if (ids.length === 0) return { items: [], total: 0 };

    const [items, [{ value: total }]] = await Promise.all([
      this.drizzle.db
        .select()
        .from(professionals)
        .where(inArray(professionals.id, ids))
        .orderBy(desc(professionals.createdAt))
        .offset(skip)
        .limit(limit),
      this.drizzle.db
        .select({ value: count() })
        .from(professionals)
        .where(inArray(professionals.id, ids)),
    ]);
    return { items: items as Professional[], total: Number(total) };
  }

  async update(id: string, data: UpdateProfessionalData): Promise<Professional> {
    const [row] = await this.drizzle.db
      .update(professionals)
      .set(data)
      .where(eq(professionals.id, id))
      .returning();
    return row as Professional;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(professionals).where(eq(professionals.id, id));
  }

  async upsertForInvite(data: UpsertProfessionalForInviteData): Promise<Professional> {
    return this.drizzle.db.transaction(async (tx) => {
      const [professional] = await tx
        .insert(professionals)
        .values({ name: data.name, email: data.email, cpf: data.cpf, phone: data.phone })
        .onConflictDoUpdate({
          target: professionals.email,
          set: { status: 'INVITED' },
        })
        .returning();

      await tx
        .insert(professionalClinics)
        .values({ professionalId: professional.id, clinicId: data.clinicId, role: data.role })
        .onConflictDoNothing();

      return professional as Professional;
    });
  }

  async getFirstClinicId(professionalId: string): Promise<string | null> {
    const [row] = await this.drizzle.db
      .select({ clinicId: professionalClinics.clinicId })
      .from(professionalClinics)
      .where(eq(professionalClinics.professionalId, professionalId))
      .limit(1);
    return row?.clinicId ?? null;
  }
}
