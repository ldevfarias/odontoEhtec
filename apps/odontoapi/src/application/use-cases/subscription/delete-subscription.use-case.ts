import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type {
  IDeleteSubscriptionUseCase,
  DeleteSubscriptionInput,
} from '../../../domain/ports/in/subscription/delete-subscription.use-case';
import {
  SUBSCRIPTION_REPOSITORY,
  type ISubscriptionRepository,
} from '../../../domain/ports/out/subscription.repository';

@Injectable()
export class DeleteSubscriptionUseCase implements IDeleteSubscriptionUseCase {
  constructor(
    @Inject(SUBSCRIPTION_REPOSITORY)
    private readonly subscriptionRepository: ISubscriptionRepository
  ) {}

  async execute(input: DeleteSubscriptionInput): Promise<void> {
    const subscription = await this.subscriptionRepository.findById(input.id);
    if (!subscription) throw new NotFoundException('Assinatura não encontrada');

    await this.subscriptionRepository.delete(input.id);
  }
}
