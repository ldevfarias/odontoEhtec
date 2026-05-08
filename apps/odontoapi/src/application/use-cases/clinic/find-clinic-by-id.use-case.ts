import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindClinicByIdUseCase,
  FindClinicByIdInput,
  FindClinicByIdOutput,
} from '../../../domain/ports/in/clinic/find-clinic-by-id.use-case';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';

@Injectable()
export class FindClinicByIdUseCase implements IFindClinicByIdUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository
  ) {}

  async execute(input: FindClinicByIdInput): Promise<FindClinicByIdOutput> {
    const clinic = await this.clinicRepository.findById(input.id);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');

    return {
      id: clinic.id,
      name: clinic.name,
      cnpj: clinic.cnpj,
      phone: clinic.phone,
      email: clinic.email,
      address: clinic.address,
      subscriberId: clinic.subscriberId,
      createdAt: clinic.createdAt,
      updatedAt: clinic.updatedAt,
    };
  }
}
