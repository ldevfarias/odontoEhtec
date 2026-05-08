import { ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  ICreateSubscriptionUseCase,
  CreateSubscriptionInput,
  CreateSubscriptionOutput,
} from '../../../domain/ports/in/subscription/create-subscription.use-case';
import {
  SUBSCRIPTION_REPOSITORY,
  type ISubscriptionRepository,
} from '../../../domain/ports/out/subscription.repository';
import {
  SUBSCRIBER_REPOSITORY,
  type ISubscriberRepository,
} from '../../../domain/ports/out/subscriber.repository';
import { PLAN_REPOSITORY, type IPlanRepository } from '../../../domain/ports/out/plan.repository';

@Injectable()
export class CreateSubscriptionUseCase implements ICreateSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository,
    @Inject(SUBSCRIBER_REPOSITORY)
    private readonly subscriberRepository: ISubscriberRepository,
    @Inject(PLAN_REPOSITORY)
    private readonly planRepository: IPlanRepository
  ) {}

  async execute(input: CreateSubscriptionInput): Promise<CreateSubscriptionOutput> {
    const [subscriber, plan] = await Promise.all([
      this.subscriberRepository.findById(input.subscriberId),
      this.planRepository.findById(input.planId),
    ]);

    if (!subscriber) throw new NotFoundException('Assinante não encontrado');
    if (!plan) throw new NotFoundException('Plano não encontrado');

    const active = await this.subscriptionRepository.findActiveBySubscriber(input.subscriberId);
    if (active) throw new ConflictException('Assinante já possui uma assinatura ativa');

    const subscription = await this.subscriptionRepository.create({
      subscriberId: input.subscriberId,
      planId: input.planId,
      status: input.status,
      startDate: input.startDate,
      endDate: input.endDate ?? null,
    });

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
