import { Injectable } from '@nestjs/common';
import type {
  IProfessionalRepository,
  CreateProfessionalData,
  UpdateProfessionalData,
  ProfessionalPage,
} from '../../../domain/ports/out/professional.repository';
import type { Professional } from '../../../domain/entities/professional.entity';
import type { PrismaService } from './prisma.service';

@Injectable()
export class PrismaProfessionalRepository implements IProfessionalRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProfessionalData): Promise<Professional> {
    return this.prisma.professional.create({ data });
  }

  async findById(id: string): Promise<Professional | null> {
    return this.prisma.professional.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<Professional | null> {
    return this.prisma.professional.findUnique({ where: { email } });
  }

  async findByCpf(cpf: string): Promise<Professional | null> {
    return this.prisma.professional.findUnique({ where: { cpf } });
  }

  async findAllByClinic(clinicId: string, page: number, limit: number): Promise<ProfessionalPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.professional.findMany({
        where: { clinicId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.professional.count({ where: { clinicId } }),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdateProfessionalData): Promise<Professional> {
    return this.prisma.professional.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.professional.delete({ where: { id } });
  }
}
