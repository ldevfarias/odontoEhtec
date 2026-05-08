import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindProfessionalByIdUseCase,
  FindProfessionalByIdInput,
  FindProfessionalByIdOutput,
} from '../../../domain/ports/in/professional/find-professional-by-id.use-case';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';

@Injectable()
export class FindProfessionalByIdUseCase implements IFindProfessionalByIdUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository
  ) {}

  async execute(input: FindProfessionalByIdInput): Promise<FindProfessionalByIdOutput> {
    const professional = await this.professionalRepository.findById(input.id);
    if (!professional) throw new NotFoundException('Profissional não encontrado');

    return {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      cpf: professional.cpf,
      phone: professional.phone,
      role: professional.role,
      clinicId: professional.clinicId,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    };
  }
}
