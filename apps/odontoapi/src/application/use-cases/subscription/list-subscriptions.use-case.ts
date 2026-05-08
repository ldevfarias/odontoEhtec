import { Inject, Injectable } from '@nestjs/common';
import type {
  IListSubscriptionsUseCase,
  ListSubscriptionsInput,
  ListSubscriptionsOutput,
} from '../../../domain/ports/in/subscription/list-subscriptions.use-case';
import {
  SUBSCRIPTION_REPOSITORY,
  type ISubscriptionRepository,
} from '../../../domain/ports/out/subscription.repository';

@Injectable()
export class ListSubscriptionsUseCase implements IListSubscriptionsUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(input: ListSubscriptionsInput): Promise<ListSubscriptionsOutput> {
    const { items, total } = await this.subscriptionRepository.findAllBySubscriber(
      input.subscriberId,
      input.page,
      input.limit
    );
    const totalPages = total === 0 ? 0 : Math.ceil(total / input.limit);

    return {
      items: items.map((s) => ({
        id: s.id,
        subscriberId: s.subscriberId,
        planId: s.planId,
        status: s.status,
        startDate: s.startDate,
        endDate: s.endDate,
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
