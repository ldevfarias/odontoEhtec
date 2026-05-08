import type { SubscriptionStatus } from '../../../entities/subscription.entity';

export const CREATE_SUBSCRIPTION_USE_CASE = Symbol('ICreateSubscriptionUseCase');

export interface CreateSubscriptionInput {
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate?: Date | null;
}

export interface CreateSubscriptionOutput {
  id: string;
  subscriberId: string;
  planId: string;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateSubscriptionUseCase {
  execute(input: CreateSubscriptionInput): Promise<CreateSubscriptionOutput>;
}
