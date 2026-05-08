import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IUpdateSubscriptionUseCase,
  UpdateSubscriptionInput,
  UpdateSubscriptionOutput,
} from '../../../domain/ports/in/subscription/update-subscription.use-case';
import {
  SUBSCRIPTION_REPOSITORY,
  type ISubscriptionRepository,
} from '../../../domain/ports/out/subscription.repository';

@Injectable()
export class UpdateSubscriptionUseCase implements IUpdateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(input: UpdateSubscriptionInput): Promise<UpdateSubscriptionOutput> {
    const subscription = await this.subscriptionRepository.findById(input.id);
    if (!subscription) throw new NotFoundException('Assinatura não encontrada');

    const updated = await this.subscriptionRepository.update(input.id, {
      status: input.status,
      endDate: input.endDate,
    });

    return {
      id: updated.id,
      subscriberId: updated.subscriberId,
      planId: updated.planId,
      status: updated.status,
      startDate: updated.startDate,
      endDate: updated.endDate,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }
}
