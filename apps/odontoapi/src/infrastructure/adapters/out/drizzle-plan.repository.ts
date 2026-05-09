import { Injectable } from '@nestjs/common';
import { count, desc, eq } from 'drizzle-orm';
import type { Plan } from '../../../domain/entities/plan.entity';
import type {
  CreatePlanData,
  IPlanRepository,
  PlanPage,
  UpdatePlanData,
} from '../../../domain/ports/out/plan.repository';
import { plans } from '../../../../drizzle/schema';
import { DrizzleService } from './drizzle.service';

@Injectable()
export class DrizzlePlanRepository implements IPlanRepository {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(data: CreatePlanData): Promise<Plan> {
    const [row] = await this.drizzle.db.insert(plans).values(data).returning();
    return row as Plan;
  }

  async findById(id: string): Promise<Plan | null> {
    const [row] = await this.drizzle.db.select().from(plans).where(eq(plans.id, id)).limit(1);
    return (row as Plan) ?? null;
  }

  async findByName(name: string): Promise<Plan | null> {
    const [row] = await this.drizzle.db.select().from(plans).where(eq(plans.name, name)).limit(1);
    return (row as Plan) ?? null;
  }

  async findAll(page: number, limit: number): Promise<PlanPage> {
    const skip = (page - 1) * limit;
    const [items, [{ value: total }]] = await Promise.all([
      this.drizzle.db.select().from(plans).orderBy(desc(plans.createdAt)).offset(skip).limit(limit),
      this.drizzle.db.select({ value: count() }).from(plans),
    ]);
    return { items: items as Plan[], total: Number(total) };
  }

  async update(id: string, data: UpdatePlanData): Promise<Plan> {
    const [row] = await this.drizzle.db.update(plans).set(data).where(eq(plans.id, id)).returning();
    return row as Plan;
  }

  async delete(id: string): Promise<void> {
    await this.drizzle.db.delete(plans).where(eq(plans.id, id));
  }
}
