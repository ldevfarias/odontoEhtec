import { ConflictException, Inject, Injectable } from '@nestjs/common';
import type {
  CreateProfessionalInput,
  CreateProfessionalOutput,
  ICreateProfessionalUseCase,
} from '../../../domain/ports/in/professional/create-professional.use-case';
import {
  PROFESSIONAL_REPOSITORY,
  type IProfessionalRepository,
} from '../../../domain/ports/out/professional.repository';

@Injectable()
export class CreateProfessionalUseCase implements ICreateProfessionalUseCase {
  constructor(
    @Inject(PROFESSIONAL_REPOSITORY)
    private readonly professionalRepository: IProfessionalRepository
  ) {}

  async execute(input: CreateProfessionalInput): Promise<CreateProfessionalOutput> {
    const [byEmail, byCpf] = await Promise.all([
      this.professionalRepository.findByEmail(input.email),
      this.professionalRepository.findByCpf(input.cpf),
    ]);

    if (byEmail) throw new ConflictException('Email já cadastrado');
    if (byCpf) throw new ConflictException('CPF já cadastrado');

    const professional = await this.professionalRepository.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      phone: input.phone ?? null,
    });

    return {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      cpf: professional.cpf,
      phone: professional.phone,
      status: professional.status,
      createdAt: professional.createdAt,
      updatedAt: professional.updatedAt,
    };
  }
}
