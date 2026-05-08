import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdateClinicUseCase,
  UpdateClinicInput,
  UpdateClinicOutput,
} from '../../../domain/ports/in/clinic/update-clinic.use-case';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';

@Injectable()
export class UpdateClinicUseCase implements IUpdateClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository
  ) {}

  async execute(input: UpdateClinicInput): Promise<UpdateClinicOutput> {
    const clinic = await this.clinicRepository.findById(input.id);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');

    const updated = await this.clinicRepository.update(input.id, {
      name: input.name,
      phone: input.phone,
      email: input.email,
      address: input.address,
    });

    return {
      id: updated.id,
      name: updated.name,
      cnpj: updated.cnpj,
      phone: updated.phone,
      email: updated.email,
      address: updated.address,
      subscriberId: updated.subscriberId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
