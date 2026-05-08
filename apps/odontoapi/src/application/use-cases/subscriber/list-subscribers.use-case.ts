import { Inject, Injectable } from '@nestjs/common';
import type {
  IListSubscribersUseCase,
  ListSubscribersInput,
  ListSubscribersOutput,
} from '../../../domain/ports/in/subscriber/list-subscribers.use-case';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';

@Injectable()
export class ListSubscribersUseCase implements IListSubscribersUseCase {
  constructor(
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository
  ) {}

  async execute(input: ListSubscribersInput): Promise<ListSubscribersOutput> {
    const { items, total } = await this.subscriberRepository.findAll(input.page, input.limit);
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((s) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        document: s.document,
        phone: s.phone,
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      })),
      total,
      page: input.page,
      limit: input.limit,
      totalPages,
    };
  }
}
