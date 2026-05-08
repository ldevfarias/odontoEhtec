import { Inject, Injectable } from '@nestjs/common';
import type {
  IListProfessionalsUseCase,
  ListProfessionalsInput,
  ListProfessionalsOutput,
} from '../../../domain/ports/in/professional/list-professionals.use-case';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';

@Injectable()
export class ListProfessionalsUseCase implements IListProfessionalsUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository
  ) {}

  async execute(input: ListProfessionalsInput): Promise<ListProfessionalsOutput> {
    const { items, total } = await this.professionalRepository.findAllByClinic(
      input.clinicId,
      input.page,
      input.limit
    );
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((p) => ({
        id: p.id,
        name: p.name,
        email: p.email,
        cpf: p.cpf,
        phone: p.phone,
        role: p.role,
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
