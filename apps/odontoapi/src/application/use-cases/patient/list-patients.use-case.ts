import { Inject, Injectable } from '@nestjs/common';
import type {
  IListPatientsUseCase,
  ListPatientsInput,
  ListPatientsOutput,
} from '../../../domain/ports/in/patient/list-patients.use-case';
import {
  PATIENT_REPOSITORY,
  type IPatientRepository,
} from '../../../domain/ports/out/patient.repository';

@Injectable()
export class ListPatientsUseCase implements IListPatientsUseCase {
  constructor(
    @Inject(PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository
  ) {}

  async execute(input: ListPatientsInput): Promise<ListPatientsOutput> {
    const { items, total } = await this.patientRepository.findAllByClinic(
      input.clinicId,
      input.page,
      input.limit
    );
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        cpf: p.cpf,
        birthDate: p.birthDate,
        phone: p.phone,
        email: p.email,
        clinicId: p.clinicId,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
