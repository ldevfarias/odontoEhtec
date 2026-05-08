import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeleteSubscriberUseCase,
  DeleteSubscriberInput,
} from '../../../domain/ports/in/subscriber/delete-subscriber.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class DeleteSubscriberUseCase implements IDeleteSubscriberUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: DeleteSubscriberInput): Promise<void> {
    const existing = await this.subscriberRepository.findById(input.id);
    if (!existing) throw new NotFoundException('Assinante não encontrado');
    await this.subscriberRepository.delete(input.id);
  }
}
