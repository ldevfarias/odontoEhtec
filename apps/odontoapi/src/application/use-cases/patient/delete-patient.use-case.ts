import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeletePatientUseCase,
  DeletePatientInput,
} from '../../../domain/ports/in/patient/delete-patient.use-case';
import {
  PATIENT_REPOSITORY,
  type IPatientRepository,
} from '../../../domain/ports/out/patient.repository';

@Injectable()
export class DeletePatientUseCase implements IDeletePatientUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository
  ) {}

  async execute(input: DeletePatientInput): Promise<void> {
    const patient = await this.patientRepository.findById(input.id);
    if (!patient) throw new NotFoundException('Paciente não encontrado');

    await this.patientRepository.delete(input.id);
  }
}
