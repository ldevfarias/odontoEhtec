import { Injectable } from '@nestjs/common';
import type {
  IPlanRepository,
  CreatePlanData,
  UpdatePlanData,
  PlanPage,
} from '../../../domain/ports/out/plan.repository';
import type { Plan } from '../../../domain/entities/plan.entity';
import type { PrismaService } from './prisma.service';

@Injectable()
export class PrismaPlanRepository implements IPlanRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePlanData): Promise<Plan> {
    return this.prisma.plan.create({ data });
  }

  async findById(id: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({ where: { id } });
  }

  async findByName(name: string): Promise<Plan | null> {
    return this.prisma.plan.findUnique({ where: { name } });
  }

  async findAll(page: number, limit: number): Promise<PlanPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.plan.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.plan.count(),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdatePlanData): Promise<Plan> {
    return this.prisma.plan.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.plan.delete({ where: { id } });
  }
}
