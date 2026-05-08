import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  ICreatePatientUseCase,
  CreatePatientInput,
  CreatePatientOutput,
} from '../../../domain/ports/in/patient/create-patient.use-case';
import {
  PATIENT_REPOSITORY,
  type IPatientRepository,
} from '../../../domain/ports/out/patient.repository';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';

@Injectable()
export class CreatePatientUseCase implements ICreatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository,
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository
  ) {}

  async execute(input: CreatePatientInput): Promise<CreatePatientOutput> {
    const clinic = await this.clinicRepository.findById(input.clinicId);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');

    const existing = await this.patientRepository.findByCpfAndClinic(input.cpf, input.clinicId);
    if (existing) throw new ConflictException('CPF já cadastrado nesta clínica');

    const patient = await this.patientRepository.create({
      name: input.name,
      cpf: input.cpf,
      birthDate: input.birthDate ?? null,
      phone: input.phone ?? null,
      email: input.email ?? null,
      clinicId: input.clinicId,
    });

    return {
      id: patient.id,
      name: patient.name,
      cpf: patient.cpf,
      birthDate: patient.birthDate,
      phone: patient.phone,
      email: patient.email,
      clinicId: patient.clinicId,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
    };
  }
}
