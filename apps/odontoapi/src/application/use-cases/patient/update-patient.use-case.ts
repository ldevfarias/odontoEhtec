import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdatePatientUseCase,
  UpdatePatientInput,
  UpdatePatientOutput,
} from '../../../domain/ports/in/patient/update-patient.use-case';
import {
  PATIENT_REPOSITORY,
  type IPatientRepository,
} from '../../../domain/ports/out/patient.repository';

@Injectable()
export class UpdatePatientUseCase implements IUpdatePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository
  ) {}

  async execute(input: UpdatePatientInput): Promise<UpdatePatientOutput> {
    const patient = await this.patientRepository.findById(input.id);
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    const updated = await this.patientRepository.update(input.id, {
      name: input.name,
      phone: input.phone,
      email: input.email,
      birthDate: input.birthDate,
    });

    return {
      id: updated.id,
      name: updated.name,
      cpf: updated.cpf,
      birthDate: updated.birthDate,
      phone: updated.phone,
      email: updated.email,
      clinicId: updated.clinicId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
