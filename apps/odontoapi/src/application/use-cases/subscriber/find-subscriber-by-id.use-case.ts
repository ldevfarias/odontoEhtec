import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindSubscriberByIdUseCase,
  FindSubscriberByIdInput,
  FindSubscriberByIdOutput,
} from '../../../domain/ports/in/subscriber/find-subscriber-by-id.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class FindSubscriberByIdUseCase implements IFindSubscriberByIdUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: FindSubscriberByIdInput): Promise<FindSubscriberByIdOutput> {
    const subscriber = await this.subscriberRepository.findById(input.id);
    if (!subscriber) throw new NotFoundException('Assinante não encontrado');

    return {
      id: subscriber.id,
      name: subscriber.name,
      email: subscriber.email,
      document: subscriber.document,
      phone: subscriber.phone,
      createdAt: subscriber.createdAt,
      updatedAt: subscriber.updatedAt,
    };
  }
}
