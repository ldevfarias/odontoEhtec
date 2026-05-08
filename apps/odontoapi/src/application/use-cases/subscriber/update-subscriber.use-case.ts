import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdateSubscriberUseCase,
  UpdateSubscriberInput,
  UpdateSubscriberOutput,
} from '../../../domain/ports/in/subscriber/update-subscriber.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class UpdateSubscriberUseCase implements IUpdateSubscriberUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: UpdateSubscriberInput): Promise<UpdateSubscriberOutput> {
    const existing = await this.subscriberRepository.findById(input.id);
    if (!existing) throw new NotFoundException('Assinante não encontrado');

    const updated = await this.subscriberRepository.update(input.id, {
      name: input.name,
      phone: input.phone,
    });

    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      document: updated.document,
      phone: updated.phone,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
