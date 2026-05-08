import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IFindSubscriptionByIdUseCase,
  FindSubscriptionByIdInput,
  FindSubscriptionByIdOutput,
} from '../../../domain/ports/in/subscription/find-subscription-by-id.use-case';
import {
  SUBSCRIPTION_REPOSITORY,
  type ISubscriptionRepository,
} from '../../../domain/ports/out/subscription.repository';

@Injectable()
export class FindSubscriptionByIdUseCase implements IFindSubscriptionByIdUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(input: FindSubscriptionByIdInput): Promise<FindSubscriptionByIdOutput> {
    const subscription = await this.subscriptionRepository.findById(input.id);
    if (!subscription) throw new NotFoundException('Assinatura não encontrada');

    return {
      id: subscription.id,
      subscriberId: subscription.subscriberId,
      planId: subscription.planId,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      createdAt: subscription.createdAt,
      updatedAt: subscription.updatedAt,
    };
  }
}
