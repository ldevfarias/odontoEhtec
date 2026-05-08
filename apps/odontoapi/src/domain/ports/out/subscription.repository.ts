import type { Subscription, SubscriptionStatus } from '../../entities/subscription.entity';

export const SUBSCRIPTION_REPOSITORY = Symbol('ISubscriptionRepository');

export interface CreateSubscriptionData {
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
}

export interface UpdateSubscriptionData {
  status?: SubscriptionStatus;
  endDate?: Date | null;
}

export interface SubscriptionPage {
  items: Subscription[];
  total: number;
}

export interface ISubscriptionRepository {
  create(data: CreateSubscriptionData): Promise<Subscription>;
  findById(id: string): Promise<Subscription | null>;
  findActiveBySubscriber(subscriberId: string): Promise<Subscription | null>;
  findAllBySubscriber(subscriberId: string, page: number, limit: number): Promise<SubscriptionPage>;
  update(id: string, data: UpdateSubscriptionData): Promise<Subscription>;
  delete(id: string): Promise<void>;
}
