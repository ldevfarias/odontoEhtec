import { Injectable } from '@nestjs/common';
import { count, desc, eq } from 'drizzle-orm';
import type { Clinic } from '../../../domain/entities/clinic.entity';
import type {
  ClinicPage,
  CreateClinicData,
  IClinicRepository,
  UpdateClinicData,
} from '../../../domain/ports/out/clinic.repository';
import { clinics } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzleClinicRepository implements IClinicRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreateClinicData): Promise<Clinic> {
    const [row] = await this.drizzle.db.insert(clinics).values(data).returning();
    return row as Clinic;
  }

  async findById(id: string): Promise<Clinic | null> {
    const [row] = await this.drizzle.db.select().from(clinics).where(eq(clinics.id, id)).limit(1);
    return (row as Clinic) ?? null;
  }

  async findByCnpj(cnpj: string): Promise<Clinic | null> {
    const [row] = await this.drizzle.db
      .select()
      .from(clinics)
      .where(eq(clinics.cnpj, cnpj))
      .limit(1);
    return (row as Clinic) ?? null;
  }

  async findAllBySubscriber(
    subscriberId: string,
    page: number,
    limit: number
  ): Promise<ClinicPage> {
    const skip = (page - 1) * limit;
    const [items, [{ value: total }]] = await Promise.all([
      this.drizzle.db
        .select()
        .from(clinics)
        .where(eq(clinics.subscriberId, subscriberId))
        .orderBy(desc(clinics.createdAt))
        .offset(skip)
        .limit(limit),
      this.drizzle.db
        .select({ value: count() })
        .from(clinics)
        .where(eq(clinics.subscriberId, subscriberId)),
    ]);
    return { items: items as Clinic[], total: Number(total) };
  }

  async update(id: string, data: UpdateClinicData): Promise<Clinic> {
    const [row] = await this.drizzle.db
      .update(clinics)
      .set(data)
      .where(eq(clinics.id, id))
      .returning();
    return row as Clinic;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(clinics).where(eq(clinics.id, id));
  }
}
