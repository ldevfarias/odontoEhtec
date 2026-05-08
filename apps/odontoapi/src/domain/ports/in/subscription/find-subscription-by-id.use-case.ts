import type { SubscriptionStatus } from '../../../entities/subscription.entity';

export const FIND_SUBSCRIPTION_BY_ID_USE_CASE = Symbol('IFindSubscriptionByIdUseCase');

export interface FindSubscriptionByIdInput {
  id: string;
}

export interface FindSubscriptionByIdOutput {
  id: string;
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindSubscriptionByIdUseCase {
  execute(input: FindSubscriptionByIdInput): Promise<FindSubscriptionByIdOutput>;
}
