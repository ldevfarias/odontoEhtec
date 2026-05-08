import { Injectable } from '@nestjs/common';
import type {
  IClinicRepository,
  CreateClinicData,
  UpdateClinicData,
  ClinicPage,
} from '../../../domain/ports/out/clinic.repository';
import type { Clinic } from '../../../domain/entities/clinic.entity';
import type { PrismaService } from './prisma.service';

@Injectable()
export class PrismaClinicRepository implements IClinicRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateClinicData): Promise<Clinic> {
    return this.prisma.clinic.create({ data });
  }

  async findById(id: string): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({ where: { id } });
  }

  async findByCnpj(cnpj: string): Promise<Clinic | null> {
    return this.prisma.clinic.findUnique({ where: { cnpj } });
  }

  async findAllBySubscriber(
    subscriberId: string,
    page: number,
    limit: number
  ): Promise<ClinicPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.clinic.findMany({
        where: { subscriberId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.clinic.count({ where: { subscriberId } }),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdateClinicData): Promise<Clinic> {
    return this.prisma.clinic.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.clinic.delete({ where: { id } });
  }
}
