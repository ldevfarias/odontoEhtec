import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindPatientByIdUseCase,
  FindPatientByIdInput,
  FindPatientByIdOutput,
} from '../../../domain/ports/in/patient/find-patient-by-id.use-case';
import {
  PATIENT_REPOSITORY,
  type IPatientRepository,
} from '../../../domain/ports/out/patient.repository';

@Injectable()
export class FindPatientByIdUseCase implements IFindPatientByIdUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository
  ) {}

  async execute(input: FindPatientByIdInput): Promise<FindPatientByIdOutput> {
    const patient = await this.patientRepository.findById(input.id);
    if (!patient) throw new NotFoundException('Paciente não encontrado');

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
