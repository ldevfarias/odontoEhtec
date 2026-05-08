import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  ICreateClinicUseCase,
  CreateClinicInput,
  CreateClinicOutput,
} from '../../../domain/ports/in/clinic/create-clinic.use-case';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class CreateClinicUseCase implements ICreateClinicUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository,
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: CreateClinicInput): Promise<CreateClinicOutput> {
    const subscriber = await this.subscriberRepository.findById(input.subscriberId);
    if (!subscriber) throw new NotFoundException('Assinante não encontrado');

    const existing = await this.clinicRepository.findByCnpj(input.cnpj);
    if (existing) throw new ConflictException('CNPJ já cadastrado');

    const clinic = await this.clinicRepository.create({
      name: input.name,
      cnpj: input.cnpj,
      phone: input.phone ?? null,
      email: input.email ?? null,
      address: input.address ?? null,
      subscriberId: input.subscriberId,
    });

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
