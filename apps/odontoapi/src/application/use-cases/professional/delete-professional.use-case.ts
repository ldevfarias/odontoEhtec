import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeleteProfessionalUseCase,
  DeleteProfessionalInput,
} from '../../../domain/ports/in/professional/delete-professional.use-case';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';

@Injectable()
export class DeleteProfessionalUseCase implements IDeleteProfessionalUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository
  ) {}

  async execute(input: DeleteProfessionalInput): Promise<void> {
    const professional = await this.professionalRepository.findById(input.id);
    if (!professional) throw new NotFoundException('Profissional não encontrado');

    await this.professionalRepository.delete(input.id);
  }
}
