import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeleteClinicUseCase,
  DeleteClinicInput,
} from '../../../domain/ports/in/clinic/delete-clinic.use-case';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';

@Injectable()
export class DeleteClinicUseCase implements IDeleteClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository
  ) {}

  async execute(input: DeleteClinicInput): Promise<void> {
    const clinic = await this.clinicRepository.findById(input.id);
    if (!clinic) throw new NotFoundException('Clínica não encontrada');

    await this.clinicRepository.delete(input.id);
  }
}
