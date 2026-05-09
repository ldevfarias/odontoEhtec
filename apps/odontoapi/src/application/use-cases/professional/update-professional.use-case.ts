import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdateProfessionalUseCase,
  UpdateProfessionalInput,
  UpdateProfessionalOutput,
} from '../../../domain/ports/in/professional/update-professional.use-case';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';

@Injectable()
export class UpdateProfessionalUseCase implements IUpdateProfessionalUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository
  ) {}

  async execute(input: UpdateProfessionalInput): Promise<UpdateProfessionalOutput> {
    const professional = await this.professionalRepository.findById(input.id);
    if (!professional) throw new NotFoundException('Profissional não encontrado');

    const updated = await this.professionalRepository.update(input.id, {
      name: input.name,
      phone: input.phone,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      cpf: updated.cpf,
      phone: updated.phone,
      status: updated.status,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
