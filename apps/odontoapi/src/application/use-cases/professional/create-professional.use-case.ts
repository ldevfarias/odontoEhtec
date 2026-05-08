import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  ICreateProfessionalUseCase,
  CreateProfessionalInput,
  CreateProfessionalOutput,
} from '../../../domain/ports/in/professional/create-professional.use-case';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';

@Injectable()
export class CreateProfessionalUseCase implements ICreateProfessionalUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository
  ) {}

  async execute(input: CreateProfessionalInput): Promise<CreateProfessionalOutput> {
    const clinic = await this.clinicRepository.findById(input.clinicId);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');

    const [byEmail, byCpf] = await Promise.all([
      this.professionalRepository.findByEmail(input.email),
      this.professionalRepository.findByCpf(input.cpf),
    ]);

    if (byEmail) throw new ConflictException('Email já cadastrado');
    if (byCpf) throw new ConflictException('CPF já cadastrado');

    const professional = await this.professionalRepository.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone ?? null,
      role: input.role,
      clinicId: input.clinicId,
    });

    return {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      cpf: professional.cpf,
      phone: professional.phone,
      role: professional.role,
      clinicId: professional.clinicId,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    };
  }
}
