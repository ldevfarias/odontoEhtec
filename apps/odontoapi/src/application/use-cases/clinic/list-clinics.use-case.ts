import { Inject, Injectable } from '@nestjs/common';
import type {
  IListClinicsUseCase,
  ListClinicsInput,
  ListClinicsOutput,
} from '../../../domain/ports/in/clinic/list-clinics.use-case';
import {
  CLINIC_REPOSITORY,
  type IClinicRepository,
} from '../../../domain/ports/out/clinic.repository';

@Injectable()
export class ListClinicsUseCase implements IListClinicsUseCase {
  constructor(
    @Inject(CLINIC_REPOSITORY)
    private readonly clinicRepository: IClinicRepository
  ) {}

  async execute(input: ListClinicsInput): Promise<ListClinicsOutput> {
    const { items, total } = await this.clinicRepository.findAllBySubscriber(
      input.subscriberId,
      input.page,
      input.limit
    );
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((c) => ({
        id: c.id,
        name: c.name,
        cnpj: c.cnpj,
        phone: c.phone,
        email: c.email,
        address: c.address,
        subscriberId: c.subscriberId,
        createdAt: c.createdAt,
        updatedAt: c.updatedAt,
      })),
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
