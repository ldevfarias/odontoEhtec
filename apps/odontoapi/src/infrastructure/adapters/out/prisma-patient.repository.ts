import { Injectable } from '@nestjs/common';
import type {
  IPatientRepository,
  CreatePatientData,
  UpdatePatientData,
  PatientPage,
} from '../../../domain/ports/out/patient.repository';
import type { Patient } from '../../../domain/entities/patient.entity';
import type { PrismaService } from './prisma.service';

@Injectable()
export class PrismaPatientRepository implements IPatientRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientData): Promise<Patient> {
    return this.prisma.patient.create({ data });
  }

  async findById(id: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { id } });
  }

  async findByCpfAndClinic(cpf: string, clinicId: string): Promise<Patient | null> {
    return this.prisma.patient.findUnique({ where: { cpf_clinicId: { cpf, clinicId } } });
  }

  async findAllByClinic(clinicId: string, page: number, limit: number): Promise<PatientPage> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.prisma.$transaction([
      this.prisma.patient.findMany({
        where: { clinicId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.patient.count({ where: { clinicId } }),
    ]);
    return { items, total };
  }

  async update(id: string, data: UpdatePatientData): Promise<Patient> {
    return this.prisma.patient.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await this.prisma.patient.delete({ where: { id } });
  }
}
