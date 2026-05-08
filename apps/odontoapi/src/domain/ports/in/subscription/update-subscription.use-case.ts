import type { SubscriptionStatus } from '../../../entities/subscription.entity';

export const UPDATE_SUBSCRIPTION_USE_CASE = Symbol('IUpdateSubscriptionUseCase');

export interface UpdateSubscriptionInput {
  id: string;
  status?: SubscriptionStatus;
  endDate?: Date | null;
}

export interface UpdateSubscriptionOutput {
  id: string;
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdateSubscriptionUseCase {
  execute(input: UpdateSubscriptionInput): Promise<UpdateSubscriptionOutput>;
}
