import type { SubscriptionStatus } from '../../../entities/subscription.entity';

export const LIST_SUBSCRIPTIONS_USE_CASE = Symbol('IListSubscriptionsUseCase');

export interface ListSubscriptionsInput {
  subscriberId: string;
  page: number;
  limit: number;
}

export interface SubscriptionItem {
  id: string;
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListSubscriptionsOutput {
  items: SubscriptionItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListSubscriptionsUseCase {
  execute(input: ListSubscriptionsInput): Promise<ListSubscriptionsOutput>;
}
